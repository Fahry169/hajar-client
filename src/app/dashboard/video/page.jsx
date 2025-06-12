"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChatTextIcon } from "@phosphor-icons/react";
import { Button, Image } from "@heroui/react";
import { formatToWIB } from "@/utilities/dateFormat";
import VideoSkeleton from "@/components/VideoSkeleton";
import { useVideoPresenter } from "./videoPresenter";

function VideoList() {
  const router = useRouter();
  const { videos, loading } = useVideoPresenter();

  const handleClick = (videoId) => {
    router.push(`/dashboard/video/comments?videoId=${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 rounded-lg shadow-md">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <VideoSkeleton />
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div
                key={video.videoId}
                onClick={() => handleClick(video.videoId)}
                className="border-2  shadow-sm cursor-pointer hover:shadow-xl hover:scale-[102%] transition-all bg-white p-4 rounded-xl"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-auto object-cover aspect-video rounded-lg"
                />
                <div className="space-y-2 px-2 py-3">
                  <p className="font-semibold text-sm leading-tight line-clamp-1">
                    {video.title}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <ChatTextIcon size={14} color="gray" />
                      <span>{video.commentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{formatToWIB(video.publishedAt)}</span>
                    </div>
                  </div>
                  {video.uploadDate && (
                    <div className="text-xs text-gray-500">
                      <p>{video.uploadDate}</p>
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-end">
                  <Button color="primary" className="bg-gradient-to-r from-red-500 to-red-700">Buka</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-20">
            Tidak ada video ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading video list...</div>}>
      <VideoList />
    </Suspense>
  );
}
