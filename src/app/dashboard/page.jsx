"use client";

import { useAuth } from "@/libs/withAuth";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Cookies from "js-cookie";
import {
  ArrowsClockwiseIcon,
  PlayIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { TbReport } from "react-icons/tb";

const Page = () => {
  const { userInfo, syncChannel } = useAuth();
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      const token = Cookies.get("authorization");
      const res = await syncChannel(token);
      console.log("Sync berhasil:", res);
      if (res.success === false) {
        console.error("Sync gagal:", res.message || "Tidak diketahui");
      }

      router.refresh();
    } catch (err) {
      console.error("Sync gagal:", err.message);
    }
  };

  const handleViewChannel = () => {
    const channelId = userInfo?.id;
    if (channelId) {
      window.open(`https://www.youtube.com/channel/${channelId}`, "_blank");
    } else {
      alert("Channel ID tidak ditemukan");
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 text-lg">Memuat data channel...</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num?.toString() || "0";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div>
        <div className="bg-white h-[calc(100vh-9rem)] rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Channel Header */}
          <div className="bg-white h-32 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          <div className="p-8">
            {/* Profile Photo Section */}
            <div className="flex justify-center -mt-16 relative z-10 mb-6">
              <div className="relative">
                <img
                  src={userInfo.thumbnail}
                  alt="Thumbnail Channel"
                  className="w-32 h-32 rounded-full shadow-lg border-4 border-white object-cover bg-white"
                />
                <div className="absolute -bottom-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a2.959 2.959 0 0 0-2.084-2.084C19.543 3.75 12 3.75 12 3.75s-7.543 0-9.414.352A2.959 2.959 0 0 0 .502 6.186C.15 8.057.15 12 .15 12s0 3.943.352 5.814a2.959 2.959 0 0 0 2.084 2.084C4.457 20.25 12 20.25 12 20.25s7.543 0 9.414-.352a2.959 2.959 0 0 0 2.084-2.084C23.85 15.943 23.85 12 23.85 12s0-3.943-.352-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Channel Info Section */}
            <div className="text-center">
              <div className="mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {userInfo.title}
                  {userInfo.customUrl}
                </h2>
              </div>

              <p className="text-gray-600 text-base mb-3 max-w-2xl mx-auto leading-relaxed">
                {userInfo.description || "Tidak ada deskripsi tersedia."}
              </p>

              <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-4">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Bergabung sejak {formatDate(userInfo.publishedAt)}
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">
                    <span className="font-bold text-gray-900">
                      {formatNumber(userInfo.subscriberCount)}
                    </span>{" "}
                    Subscriber
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">
                    <span className="font-bold text-gray-900">
                      {userInfo.videoCount || 0}
                    </span>{" "}
                    Video
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">
                    <span className="font-bold text-gray-900">
                      {formatNumber(userInfo.viewCount || 0)}
                    </span>{" "}
                    Total Views
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 pb-8 pt-4">
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <Button
                onPress={handleViewChannel}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                <YoutubeLogoIcon size={20} weight="fill" />
                Lihat Channel
              </Button>
              <Button
                as={Link}
                href="/dashboard/video"
                color="primary"
                className="bg-blue-600 hover:bg-blue-700 px-6 font-semibold"
              >
                <PlayIcon weight="fill" />
                Video
              </Button>
              <Button
                as={Link}
                href="/dashboard/report"
                className="bg-green-600 hover:bg-green-700 text-white px-6 font-semibold"
              >
                <TbReport size={20} weight="fill" />
                Report
              </Button>
              <Button
                onPress={handleRefresh}
                color="primary"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ArrowsClockwiseIcon size={20} />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
