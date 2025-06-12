"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/libs/withAuth";
import { ChatTextIcon } from "@phosphor-icons/react";
import { Image } from "@heroui/react";
import { formatToWIB } from "@/utilities/dateFormat";
import VideoSkeleton from "@/components/VideoSkeleton";

function VideoList() {
  const router = useRouter();
  const { videos } = useAuth();

  const handleClick = (videoId) => {
    router.push(`/dashboard/video/comments?videoId=${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 rounded-lg shadow-md">
      <div className="max-w-6xl mx-auto">
        <div>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video) => (
                <div
                  key={video.videoId}
                  onClick={() => handleClick(video.videoId)}
                  className="border-2 rounded-sm shadow-sm cursor-pointer hover:shadow-xl hover:scale-105 transition-all bg-white"
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-auto rounded-sm object-cover aspect-video"
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
                </div>
              ))}
            </div>
          ) : (
            <VideoSkeleton />
          )}
        </div>
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
