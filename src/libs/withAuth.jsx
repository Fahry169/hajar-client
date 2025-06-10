'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BASE_API } from '@/libs/environtment'; // Pastikan ini ada
import { createContext, useContext } from 'react';

const AUTH_COOKIE_NAME = 'authorization';
const LOGIN_ROUTE = '/';
export const AuthContext = createContext({ videos: [], comments: {} });

export const setAuthToken = (token) => {
  Cookies.set(AUTH_COOKIE_NAME, token, { expires: 1 / 24 }); // 1 jam
  console.log('Token disimpan ke cookie');
};

export function useAuth() {
  return useContext(AuthContext);
}

export const logout = (router) => {
  Cookies.remove(AUTH_COOKIE_NAME);
  console.log('Token dihapus, redirect ke landing page');
  router.push(LOGIN_ROUTE);
};

const isAuthenticated = () => Boolean(Cookies.get(AUTH_COOKIE_NAME));

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [authed, setAuthed] = useState(false);
    const [videos, setVideos] = useState([]); // optional, kalau memang perlu
    const [comments, setComments] = useState({});
    const token = Cookies.get(AUTH_COOKIE_NAME);

    const deleteCommentById = async (channelId, videoId, commentId) => {
      try {
        const res = await fetch(
          `${BASE_API}/${channelId}/${videoId}/${commentId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Gagal menghapus komentar');

        // Hapus komentar dari state lokal
        setComments((prev) => {
          const updated = { ...prev };
          updated[videoId] = updated[videoId].filter(
            (c) => c.commentId !== commentId
          );
          return updated;
        });

        console.log(`Komentar ${commentId} berhasil dihapus`);
      } catch (error) {
        console.error('Gagal menghapus komentar:', error.message);
      }
    };

    const refreshComments = async (channelId, videoId) => {
      try {
        const res = await fetch(
          `${BASE_API}/${channelId}/${videoId}/comments/sync`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!data.comments)
          throw new Error('Sinkronisasi gagal atau tidak ada komentar.');

        setComments((prev) => ({
          ...prev,
          [videoId]: data.comments,
        }));

        console.log(`Komentar video ${videoId} berhasil disinkronisasi`);
      } catch (error) {
        console.error('Gagal refresh komentar:', error.message);
      }
    };

    const fetchCommentsForVideos = async (channelId, videos) => {
      const newComments = {};

      for (const video of videos) {
        try {
          // Mengambil komentar untuk setiap video dari database
          const res = await fetch(
            `${BASE_API}/${channelId}/${video.videoId}/comments`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();

          // Jika komentar kosong, lakukan sinkronisasi dari YouTube
          if ((data.comments || []).length === 0) {
            console.log(
              `Komentar kosong untuk ${video.videoId}, sinkronisasi...`
            );

            const syncRes = await fetch(
              `${BASE_API}/${channelId}/${video.videoId}/comments/sync`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const syncData = await syncRes.json();
            newComments[video.videoId] = syncData.comments || [];
          } else {
            newComments[video.videoId] = data.comments || [];
          }
        } catch (err) {
          console.error(
            `Komentar gagal diambil untuk ${video.videoId}:`,
            err.message
          );
          newComments[video.videoId] = [];
        }
      }

      setComments(newComments);
    };

    const fetchChannelAndVideos = async (token) => {
      try {
        // Mengambil channel dari API
        const res = await fetch(`${BASE_API}/channels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        // Cek apakah ada channel yang ditemukan
        if ((data.channels || []).length === 0) {
          console.log('Channel belum ada di Firestore. Sinkronisasi...');
          // Sinkronisasi channel, jika belum ada sinkronisasi dan lakukan fetch ulang
          await fetch(`${BASE_API}/channels/sync`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // ambil lagi setelah sinkronisasi
          return fetchChannelAndVideos(token);
        }

        const channelId = data.channels?.[0]?.id;
        if (!channelId) throw new Error('Channel ID tidak ditemukan');

        // Panggil video berdasarkan channelId
        const videoRes = await fetch(`${BASE_API}/${channelId}/videos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const videoData = await videoRes.json();
        setVideos(videoData.videos || []);
        await fetchCommentsForVideos(channelId, videoData.videos || []);
      } catch (err) {
        console.error('Gagal mengambil channel, video, atau komentar:', err);
      }
    };

    useEffect(() => {
      const tokenFromUrl = searchParams.get('token');

      if (tokenFromUrl) {
        setAuthToken(tokenFromUrl);
        router.replace(pathname);
        setAuthed(true);
        return;
      }

      if (isAuthenticated()) {
        console.log('Token valid, user login');
        fetchChannelAndVideos(token).then(() => {
          setAuthed(true);
        });
      } else {
        console.log('Tidak ada token, redirect');
        router.push(LOGIN_ROUTE);
      }
    }, [pathname, searchParams, router]);

    return authed ? (
      <AuthContext.Provider
        value={{ videos, comments, refreshComments, deleteCommentById }}>
        <Component {...props} />
      </AuthContext.Provider>
    ) : null;
  };
}
