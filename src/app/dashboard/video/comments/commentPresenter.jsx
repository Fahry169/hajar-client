'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export function useCommentPresenter(videoId) {
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get('authorization');

  useEffect(() => {
    if (!token || !videoId) return; 

    const loadVideoAndComments = async () => {
      try {
        const channelRes = await fetch(`${BASE_API}/channels`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const channelData = await channelRes.json();
        const channelId = channelData.channels?.[0]?.id;
        if (!channelId) return;

        const videoRes = await fetch(`${BASE_API}/${channelId}/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const videoData = await videoRes.json();
        const found = videoData.videos?.find((v) => v.videoId === videoId);
        if (!found) return;
        setVideo({ ...found, channelId });

        await fetchComments(channelId, videoId);
      } catch (err) {
        console.error('Gagal load video/comment:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVideoAndComments();
  }, [token, videoId]);

  const fetchComments = async (channelId, videoId) => {
    try {
      const res = await fetch(`${BASE_API}/${channelId}/${videoId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const raw = data.comments || [];

      if (raw.length === 0) {
        const syncRes = await fetch(`${BASE_API}/${channelId}/${videoId}/comments/sync`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
        const syncData = await syncRes.json();
        setComments(syncData.comments || []);
      } else {
        setComments(raw);
      }
    } catch (error) {
      console.error('Gagal ambil komentar:', error);
      setComments([]);
    }
  };

  const refreshComments = async () => {
    if (!video) return;
    const res = await fetch(
      `${BASE_API}/${video.channelId}/${video.videoId}/comments/sync`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setComments(data.comments || []);
  };

  const deleteComment = async (commentId) => {
    if (!video) return;
    const res = await fetch(
      `${BASE_API}/${video.channelId}/${video.videoId}/${commentId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error('Gagal menghapus komentar');

    setComments((prev) =>
      prev.filter((comment) => comment.commentId !== commentId)
    );
  };

  const syncChannel = async () => {
    const res = await fetch(`${BASE_API}/channels/sync`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Gagal sync channel');
    return await res.json();
  };

  return {
    video,
    comments: comments.filter((c) => c.status !== 'hidden'),
    loading,
    refreshComments,
    deleteComment,
    syncChannel,
  };
}
