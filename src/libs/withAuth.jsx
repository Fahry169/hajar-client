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
      // 1. Menambahkan pengecekan di awal untuk memastikan token ada.
      if (!token) {
        console.error(
          'Gagal menghapus: Token tidak ditemukan. Silakan login ulang.'
        );
        return; // Hentikan eksekusi jika tidak ada token
      }

      // 2. Menambahkan log yang lebih detail untuk debugging
      console.log(`Mencoba menghapus komentar dengan detail:`, {
        channelId,
        videoId,
        commentId,
      });

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

        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({})); 
          const errorMessage =
            errorData.message || `Server merespons dengan status ${res.status}`;
          throw new Error(errorMessage);
        } 

        setComments((prev) => {
          const updated = { ...prev };
          if (updated[videoId]) {
            updated[videoId] = updated[videoId].filter(
              (c) => c.commentId !== commentId
            );
          }
          return updated;
        });

        console.log(`Komentar ${commentId} berhasil dihapus dari UI.`);
      } catch (error) {
        console.error('Gagal menghapus komentar:', error.message);
        // Anda bisa menambahkan feedback untuk user di sini jika diperlukan
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
        // Coba ambil channel dari database kita terlebih dahulu
        const channelsRes = await fetch(`${BASE_API}/channels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!channelsRes.ok) {
          throw new Error('Gagal menghubungi server untuk mengambil channel.');
        }

        let data = await channelsRes.json();
        let channels = data.channels || [];

        // Jika channel tidak ditemukan di database, lakukan sinkronisasi
        if (channels.length === 0) {
          console.log(
            'Channel belum ada. Memulai sinkronisasi dari YouTube...'
          );

          const syncRes = await fetch(`${BASE_API}/channels/sync`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const syncData = await syncRes.json();

          if (!syncRes.ok || (syncData.channels || []).length === 0) {
            // Jika sinkronisasi gagal atau YouTube tidak mengembalikan channel
            throw new Error(
              'Sinkronisasi gagal atau tidak ada channel ditemukan di akun YouTube Anda.'
            );
          }
          console.log('Sinkronisasi berhasil!');
          channels = syncData.channels;
        }
        const channelId = channels[0]?.id;

        if (!channelId) {
          throw new Error(
            'Gagal mendapatkan Channel ID setelah proses selesai.'
          );
        }

        console.log(`Mengambil video untuk Channel ID: ${channelId}`);

        // Panggil API untuk mengambil video berdasarkan channelId
        const videoRes = await fetch(`${BASE_API}/${channelId}/videos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!videoRes.ok) {
          throw new Error('Gagal mengambil daftar video.');
        }

        const videoData = await videoRes.json();
        const videos = videoData.videos || [];
        setVideos(videos); 

        // Lanjutkan untuk mengambil komentar
        await fetchCommentsForVideos(channelId, videos);
      } catch (err) {
        console.error('Terjadi kesalahan dalam proses pengambilan data:', err);
      } finally {
        console.log('Proses pengambilan data selesai.');
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
