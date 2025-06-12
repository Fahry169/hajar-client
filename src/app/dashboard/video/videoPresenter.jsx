'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export function useVideoPresenter() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Ambil token di client-only
    const t = Cookies.get('authorization');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchVideos = async () => {
      try {
        let channelId = null;

        // 1. Coba ambil channel dari cache API
        const resChannel = await fetch(`${BASE_API}/channels`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataChannel = await resChannel.json();

        if (dataChannel.channels?.length > 0) {
          channelId = dataChannel.channels[0].id;
        } else {
          // 2. Kalau kosong, coba sync
          const syncRes = await fetch(`${BASE_API}/channels/sync`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
          });
          const syncData = await syncRes.json();
          channelId = syncData.channels?.[0]?.id;
        }

        if (!channelId) {
          console.warn('Channel ID tidak ditemukan bahkan setelah sync.');
          return;
        }

        // 3. Fetch video dari channel yang ditemukan
        const resVideos = await fetch(`${BASE_API}/${channelId}/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataVideos = await resVideos.json();
        setVideos(dataVideos.videos || []);
      } catch (err) {
        console.error('Gagal fetch video:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [token]);

  return { videos, loading };
}
