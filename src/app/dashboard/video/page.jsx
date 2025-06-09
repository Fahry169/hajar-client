'use client';
import { useRouter } from 'next/navigation';
import { logout, useAuth } from '@/libs/withAuth';

function Page() {
  const router = useRouter();
  const { videos } = useAuth(); // Mengambil data videos dari context Auth

  const handleClick = (videoId) => {
    router.push(`/dashboard/video/comments?videoId=${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Video List</h2>
            <h2 className="text-sm font-normal mb-2">
              Silahkan pilih video yang ingin di hajar
            </h2>
            {videos.length > 0 ? (
              <ul className="flex flex-wrap gap-4">
                {videos.map((video) => (
                  <li
                    key={video.videoId}
                    onClick={() => handleClick(video.videoId)}
                    className="w-64 border-2 p-2 rounded-md shadow-sm cursor-pointer hover:shadow-md transition">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-auto rounded-md"
                    />
                    <p className="mt-2 font-semibold">{video.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Tidak ada video ditemukan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
