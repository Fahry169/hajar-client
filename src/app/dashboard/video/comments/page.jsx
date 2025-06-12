"use client";

import { useSearchParams } from "next/navigation";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaTrashRestore } from "react-icons/fa";
import { LiaEyeSolid } from "react-icons/lia";
import { IoMdRefresh } from "react-icons/io";
import { Button, Image, addToast } from "@heroui/react";
import { formatToWIB } from "@/utilities/dateFormat";
import { PlayIcon } from "@phosphor-icons/react";
import { Suspense } from "react";
import { useCommentPresenter } from "./commentPresenter";

function CommentPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const {
    video,
    comments,
    loading,
    refreshComments,
    deleteComment,
    deleteAllComments,
  } = useCommentPresenter(videoId);

  const handleRefresh = async () => {
    try {
      addToast({
        title: "Memuat...",
        description: "Sedang mendeteksi komentar",
        color: "primary",
      });
      await refreshComments();
      addToast({
        title: "Berhasil",
        description: "Komentar berhasil diperbarui",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal refresh komentar",
        color: "danger",
      });
    }
  };

  const handleDeleteCommentById = async (commentId) => {
    try {
      addToast({
        title: "Memuat...",
        description: "Sedang menghapus semua komentar judi online",
        color: "primary",
      });
      await deleteComment(commentId);
      addToast({
        title: "Berhasil",
        description: "Komentar berhasil dihapus",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal hapus komentar",
        color: "danger",
      });
    }
  };

  const handleWatchVideo = () => {
    if (videoId) {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(url, "_blank");
      addToast({
        title: "Video Dibuka",
        description: "Video sedang dibuka di tab baru",
        color: "primary",
      });
    }
  };

  const handleHajarAction = async () => {
    try {
      await deleteAllComments();
      addToast({
        title: "Berhasil",
        description: "Semua komentar berhasil dihapus",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal menghapus semua komentar",
        color: "danger",
      });
    }
  };

  if (loading || !video) {
    return (
      <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 text-lg">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-white p-4 lg:p-6 ">
        <div className="max-w-full lg:max-w-md">
          <div className="group mb-4">
            <Image
              src={video.thumbnail}
              alt={video.title}
              width={600}
              height={260}
              className="object-cover"
            />
          </div>

          <h2 className="text-lg lg:text-xl font-bold mb-3 text-gray-800 line-clamp-2">
            {video.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <AiFillLike />
              <span>{video.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaComment />
              <span>{video.commentCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <LiaEyeSolid />
              <span>{video.viewCount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <p className="text-xs lg:text-sm text-gray-500 mb-4">
            {formatToWIB(video.publishedAt)}
          </p>

          <Button
            onPress={handleWatchVideo}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            <PlayIcon size={18} weight="bold" />
            Tonton di YouTube
          </Button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-3 lg:p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base lg:text-lg font-semibold text-gray-800">
              Komentar Judi Online
            </h1>
            <div className="flex gap-1 lg:gap-2">
              <Button
                onPress={handleRefresh}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm flex items-center gap-1 lg:gap-2"
              >
                <IoMdRefresh
                  size={14}
                  className="hidden sm:block sm:w-4 sm:h-4 "
                />
                <span className="text-xs sm:text-sm">Deteksi</span>
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm"
                onPress={handleHajarAction}
              >
                <span className="text-xs sm:text-sm">Hapus Semua</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {comments.length > 0 ? (
            <div className="p-2 lg:p-4 space-y-2">
              {comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 lg:p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-2 lg:gap-3">
                    {comment.authorProfileImageURL && (
                      <img
                        src={comment.authorProfileImageURL}
                        alt={comment.author}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 text-xs lg:text-sm truncate">
                          {comment.author}
                        </h3>
                      </div>
                      <p className="text-gray-700 text-xs lg:text-sm leading-relaxed break-words">
                        {comment.text}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCommentById(comment.commentId)}
                      className="p-1 lg:p-2 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                      title="Hapus komentar"
                    >
                      <FaTrashRestore className="text-red-500 hover:text-red-700 transition-colors w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 lg:py-16">
              <FaComment className="text-gray-300 text-4xl lg:text-6xl mb-4" />
              <p className="text-gray-500 text-sm lg:text-lg">
                Tidak ada komentar ditemukan.
              </p>
            </div>
          )}
        </div>
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
