"use client";
import { useAuth } from "@/libs/withAuth";
import { useSearchParams } from "next/navigation";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaTrashRestore } from "react-icons/fa";
import { LiaEyeSolid } from "react-icons/lia";
import { IoMdRefresh } from "react-icons/io";
import { Button, Image, addToast } from "@heroui/react";
import { formatToWIB } from "@/utilities/dateFormat";
import { PlayIcon } from "@phosphor-icons/react";
import { Suspense } from "react";

function Page() {
  const searchParams = useSearchParams();
  const { comments, videos, refreshComments, deleteCommentById } = useAuth();
  const videoId = searchParams.get("videoId");

  const videoComments = (comments[videoId] || []).filter(
    (comment) => comment.status !== "hidden"
  );
  const videoData = videos.find((v) => v.videoId === videoId);

  const handleRefresh = async () => {
    if (videoData?.channelId && videoData?.videoId) {
      try {
        await refreshComments(videoData.channelId, videoData.videoId);
        addToast({
          title: "Berhasil",
          description: "Komentar berhasil diperbarui",
          color: "success",
        });
      } catch (error) {
        addToast({
          title: "Gagal",
          description: "Gagal memperbarui komentar",
          color: "danger",
        });
      }
    }
  };

  const handleDeleteCommentById = async (commentId) => {
    if (videoData?.channelId && videoData?.videoId) {
      try {
        await deleteCommentById(
          videoData.channelId,
          videoData.videoId,
          commentId
        );
        addToast({
          title: "Berhasil",
          description: "Komentar berhasil dihapus",
          color: "success",
        });
      } catch (error) {
        addToast({
          title: "Gagal",
          description: "Gagal menghapus komentar",
          color: "danger",
        });
      }
    }
  };

  const handleWatchVideo = () => {
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(youtubeUrl, "_blank");
      addToast({
        title: "Video Dibuka",
        description: "Video sedang dibuka di tab baru",
        color: "primary",
      });
    }
  };

  const handleHajarAction = () => {
    // Implementasi aksi HAJAR di sini
    addToast({
      title: "Aksi HAJAR",
      description: "Fitur HAJAR akan segera diimplementasikan",
      color: "warning",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-lg shadow-md flex flex-col sm:flex-row">
      <div className="basis-1/2 border-r-2">
        {videoData && (
          <div className="flex flex-col p-5 gap-4">
            <div className="relative group">
              <Image
                src={videoData.thumbnail}
                alt={videoData.title}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow mb-2 object-cover cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={handleWatchVideo}
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg cursor-pointer"
                onClick={handleWatchVideo}
              >
                <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <svg
                    className="w-8 h-8 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold line-clamp-2 sm:line-clamp-1">
                {videoData.title}
              </h2>
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="flex items-center gap-2 px-2 py-1 rounded-full">
                  <AiFillLike className="text-gray-700" />
                  <span className="text-md text-gray-700">
                    {videoData.likeCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaComment className="text-gray-700" />
                  <span className="text-md text-gray-700">
                    {videoData.commentCount}
                  </span>
                </div>
                <p className="text-md text-gray-700 flex items-center gap-2">
                  <LiaEyeSolid size={20} />
                  {videoData.viewCount.toLocaleString("id-ID")} views
                </p>
                <p className="text-md text-gray-700">
                  {formatToWIB(videoData.publishedAt)}
                </p>
              </div>
              <div className="mt-2">
                <Button
                  onPress={handleWatchVideo}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <PlayIcon size={18} weight="bold" />
                  Tonton di YouTube
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="basis-1/2">
        <div className="flex items-center justify-between px-2 py-2 border-b-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Comment List</h1>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              onPress={handleRefresh}
              size=""
              className="px-3 rounded-lg"
            >
              <IoMdRefresh size={20} />
            </Button>
            <Button
              className="text-xs sm:text-sm bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-6"
              onPress={handleHajarAction}
            >
              HAJAR
            </Button>
          </div>
        </div>
        {videoComments.length > 0 ? (
          <ul className="">
            {videoComments.map((comment, idx) => (
              <li
                key={idx}
                className="border p-3 bg-white shadow-sm flex gap-4 flex-row sm:items-center hover:bg-gray-50 transition-colors"
              >
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
                  title="Hapus komentar"
                >
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
      <Page />
    </Suspense>
  );
}