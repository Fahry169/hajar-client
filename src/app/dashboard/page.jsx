'use client';

import { useAuth, logout } from '@/libs/withAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import Cookies from 'js-cookie';

const Page = () => {
  const { videos, userInfo, syncChannel } = useAuth();
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      const token = Cookies.get('authorization');
      const res = await syncChannel(token);
      console.log('Sync berhasil:', res);
      if (res.success === false) {
        console.error('Sync gagal:', res.message || 'Tidak diketahui');
      }

      router.refresh();
    } catch (err) {
      console.error('Sync gagal:', err.message);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat data channel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-md px-8 py-10 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Welcome!
              </h1>
            </div>
            <Button
              onPress={handleRefresh}
              color="primary"
              className=" text-white font-semibold px-6 py-2 rounded-md">
              Refresh
            </Button>
          </div>

          <div className="flex items-center space-x-12 ">
            <img
              src={userInfo.thumbnail}
              alt="Thumbnail Channel"
              className="w-28 h-28 rounded-full shadow-md border object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {userInfo.title}
              </h2>
              <p className="text-gray-500 text-sm ">
                {userInfo.subscriberCount || 'Tidak ada deskripsi channel.'}{' '}
                Subscriber {userInfo.videoCount || 'Tidak ada video.'} Video
              </p>
              <p className="text-gray-500 text-sm">
                {userInfo.description || 'Tidak ada deskripsi channel.'}
              </p>
              <p className="text-gray-500 text-sm">
                Bergabung sejak{' '}
                {new Date(userInfo.publishedAt).toLocaleString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md px-8 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Video List</h2>
          {videos.length > 0 ? (
            <ul className="grid md:grid-cols-2 gap-8">
              {videos.map((video) => (
                <li
                  key={video.videoId}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition">
                  <img
                    src={video.thumbnail || '/placeholder-thumbnail.png'}
                    alt={video.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                      <span>
                        {video.viewCount.toLocaleString('id-ID')} views
                      </span>
                      <span>
                        {new Date(video.publishedAt).toLocaleString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              Belum ada video ditemukan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;