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

    const fetchCommentsForVideos = async (channelId, videos) => {
      const newComments = {};

      for (const video of videos) {
        try {
          const res = await fetch(
            BASE_API + `/${channelId}/${video.videoId}/comments`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) throw new Error('Gagal fetch komentar');

          const data = await res.json();
          newComments[video.videoId] = data.comments || [];
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
        const channelRes = await fetch(`${BASE_API}/channel`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const channelData = await channelRes.json();
        const channelId = channelData.channels?.[0]?.id;
        if (!channelId) throw new Error('Channel ID tidak ditemukan');

        const videoRes = await fetch(`${BASE_API}/${channelId}/video`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const videoData = await videoRes.json();
        const fetchedVideos = videoData.videos || [];
        setVideos(fetchedVideos);

        await fetchCommentsForVideos(channelId, fetchedVideos);
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
      <AuthContext.Provider value={{ videos, comments }}>
        <Component {...props} />
      </AuthContext.Provider>
    ) : null;
  };
}
