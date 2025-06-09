'use client';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/libs/withAuth';

function Page() {
  const searchParams = useSearchParams();
  const { comments, videos } = useAuth();
  const videoId = searchParams.get('videoId');

  const videoComments = comments[videoId] || [];
  const videoData = videos.find((v) => v.videoId === videoId);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">
        Komentar untuk Video: {videoId}
      </h1>

      {videoData && (
        <div className="mb-6">
          <img
            src={videoData.thumbnail}
            alt={videoData.title}
            className="w-full max-w-md rounded-lg shadow mb-2"
          />
          <h2 className="text-lg font-semibold">{videoData.title}</h2>
        </div>
      )}

      {videoComments.length > 0 ? (
        <ul className="space-y-2">
          {videoComments.map((comment, idx) => (
            <li key={idx} className="border p-3 rounded-md bg-white shadow-sm">
              <h3 className="font-semibold mb-2">{comment.author}</h3>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Tidak ada komentar ditemukan.</p>
      )}
    </div>
  );
}

export default Page;