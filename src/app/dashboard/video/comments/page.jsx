"use client";
import { useAuth } from "@/libs/withAuth";
import { useSearchParams } from "next/navigation";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaTrashRestore } from "react-icons/fa";
import { LiaEyeSolid } from "react-icons/lia";
import { IoMdRefresh } from "react-icons/io";
import { Button, Image } from "@heroui/react";

function Page() {
  const searchParams = useSearchParams();
  const { comments, videos, refreshComments, deleteCommentById } = useAuth();
  const videoId = searchParams.get("videoId");

  const videoComments = (comments[videoId] || []).filter(
    (comment) => comment.status !== "deleted"
  );
  const videoData = videos.find((v) => v.videoId === videoId);

  const handleRefresh = () => {
    if (videoData?.channelId && videoData?.videoId) {
      refreshComments(videoData.channelId, videoData.videoId);
    }
  };

  const handleDeleteCommentById = (commentId) => {
    if (videoData?.channelId && videoData?.videoId) {
      deleteCommentById(videoData.channelId, videoData.videoId, commentId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-lg shadow-md flex flex-col sm:flex-row">
      <div className="basis-1/2 border-r-2">
        {videoData && (
          <div className="flex flex-col p-5 gap-4">
            <Image
              src={videoData.thumbnail}
              alt={videoData.title}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg shadow mb-2 object-cover"
            />
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold line-clamp-2 sm:line-clamp-1">{videoData.title}</h2>
              <div className="flex items-center gap-4 lg:gap-8  ">
                <div className="flex items-center gap-2 px-2 py-1 bg- rounded-full">
                  <AiFillLike className="text-blue-500" />
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
                <p className="text-md text-gray-700 flex items-center gap-1">
                  <LiaEyeSolid size={20} />
                  {videoData.viewCount.toLocaleString("id-ID")} views
                </p>
                <p className="text-md text-gray-700">
                  {new Date(videoData.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="basis-1/2">
        <div className="flex items-center justify-between px-2 py-2">
          <div>
            <h1 className="text-xl sm:text-2xl  font-semibold">Comment List</h1>
          </div>
          <div className="flex gap-2">
            <Button color="primary" onPress={handleRefresh} size="" className="px-3 rounded-lg">
              <IoMdRefresh size={20}/>
            </Button>
            <Button className="text-xs sm:text-sm bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-6">HAJAR</Button>
          </div>
        </div>
        {videoComments.length > 0 ? (
          <ul className="">
            {videoComments.map((comment, idx) => (
              <li
                key={idx}
                className="border p-3 rounded-md bg-white shadow-sm flex gap-4 flex-row sm:items-center"
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
                  <p>{comment.text}</p>
                </div>
                <button
                  onClick={() => handleDeleteCommentById(comment.commentId)}
                >
                  <FaTrashRestore className="text-red-500 self-end sm:self-auto hover:text-red-300 transition-all" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Tidak ada komentar ditemukan.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
