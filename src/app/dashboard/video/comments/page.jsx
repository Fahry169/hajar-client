'use client';

import { useSearchParams } from 'next/navigation';
import { AiFillLike } from 'react-icons/ai';
import { FaComment, FaTrashRestore } from 'react-icons/fa';
import { LiaEyeSolid } from 'react-icons/lia';
import { IoMdRefresh } from 'react-icons/io';
import { Button, Image, addToast } from '@heroui/react';
import { formatToWIB } from '@/utilities/dateFormat';
import { PlayIcon } from '@phosphor-icons/react';
import { Suspense } from 'react';
import { useCommentPresenter } from './commentPresenter';

function CommentPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');
  const { video, comments, loading, refreshComments, deleteComment, deleteAllComments } =
    useCommentPresenter(videoId);

  const handleRefresh = async () => {
    try {
      await refreshComments();
      addToast({
        title: 'Berhasil',
        description: 'Komentar berhasil diperbarui',
        color: 'success',
      });
    } catch (err) {
      addToast({
        title: 'Gagal',
        description: err.message || 'Gagal refresh komentar',
        color: 'danger',
      });
    }
  };

  const handleDeleteCommentById = async (commentId) => {
    try {
      await deleteComment(commentId);
      addToast({
        title: 'Berhasil',
        description: 'Komentar berhasil dihapus',
        color: 'success',
      });
    } catch (err) {
      addToast({
        title: 'Gagal',
        description: err.message || 'Gagal hapus komentar',
        color: 'danger',
      });
    }
  };

  const handleWatchVideo = () => {
    if (videoId) {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(url, '_blank');
      addToast({
        title: 'Video Dibuka',
        description: 'Video sedang dibuka di tab baru',
        color: 'primary',
      });
    }
  };

  const handleHajarAction = async () => {
    try {
      await deleteAllComments();
      addToast({
        title: 'Berhasil',
        description: 'Semua komentar berhasil dihapus',
        color: 'success',
      });
    } catch (err) {
      addToast({
        title: 'Gagal',
        description: err.message || 'Gagal menghapus semua komentar',
        color: 'danger',
      });
    }
  };

  if (loading || !video) {
    return <div className="p-8">Memuat data video dan komentar...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 rounded-lg shadow-md flex flex-col sm:flex-row">
      <div className="basis-1/2 border-r-2">
        <div className="flex flex-col p-5 gap-4">
          <div className="relative group">
            <Image
              src={video.thumbnail}
              alt={video.title}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg shadow mb-2 object-cover cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={handleWatchVideo}
            />
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg cursor-pointer"
              onClick={handleWatchVideo}>
              <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <PlayIcon size={32} weight="fill" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold line-clamp-2 sm:line-clamp-1">
              {video.title}
            </h2>
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2 px-2 py-1 rounded-full">
                <AiFillLike className="text-gray-700" />
                <span className="text-md text-gray-700">{video.likeCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaComment className="text-gray-700" />
                <span className="text-md text-gray-700">
                  {video.commentCount}
                </span>
              </div>
              <p className="text-md text-gray-700 flex items-center gap-2">
                <LiaEyeSolid size={20} />
                {video.viewCount.toLocaleString('id-ID')} views
              </p>
              <p className="text-md text-gray-700">
                {formatToWIB(video.publishedAt)}
              </p>
            </div>
            <div className="mt-2">
              <Button
                onPress={handleWatchVideo}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2">
                <PlayIcon size={18} weight="bold" />
                Tonton di YouTube
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="basis-1/2">
        <div className="flex items-center justify-between px-2 py-2 border-b-2">
          <h1 className="text-xl sm:text-2xl font-semibold">Comment List</h1>
          <div className="flex gap-2">
            <Button
              onPress={handleRefresh}
              color="primary"
              className="px-3 rounded-lg">
              <IoMdRefresh size={20} />
            </Button>
            <Button
              className="text-xs sm:text-sm bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-6"
              onPress={handleHajarAction}>
              HAJAR
            </Button>
          </div>
        </div>

        {comments.length > 0 ? (
          <ul>
            {comments.map((comment, idx) => (
              <li
                key={idx}
                className="border p-3 bg-white shadow-sm flex gap-4 flex-row sm:items-center hover:bg-gray-50 transition-colors">
                {comment.authorProfileImageURL && (
                  <img
                    src={comment.authorProfileImageURL}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{comment.author}</h3>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
                <button
                  onClick={() => handleDeleteCommentById(comment.commentId)}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors"
                  title="Hapus komentar">
                  <FaTrashRestore className="text-red-500 hover:text-red-700 transition-colors" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-32">
            <div className="mb-4">
              <FaComment className="text-gray-300 text-6xl mx-auto mb-4" />
            </div>
            <p className="text-gray-500 text-lg">
              Tidak ada komentar ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WrappedPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading comments...</div>}>
      <CommentPage />
    </Suspense>
  );
}
