'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { BASE_API } from '@/libs/environtment';
import Link from 'next/link';

export default function DashboardPage() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await fetch(BASE_API + '/youtube/channels', {
        headers: {
          Authorization: `Bearer ${Cookies.get('authorization')}`,
        },
      });
      const data = await res.json();

      if (res.ok && data.channels) {
        setChannels(data.channels);
      } else {
        console.error('Failed to fetch channels:', data.error || data);
      }
    } catch (err) {
      console.error('Error fetching channels:', err);
    }
  };

  return (
    <main>
      <h1>Pilih Channel</h1>
      <div style={{ display: 'grid', gap: '20px' }}>
        {channels.map((channel) => (
          <Link
            key={channel.id}
            href={`/dashboard/${channel.id}/videos`}
            style={{
              border: '1px solid #ccc',
              padding: '12px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '400px',
            }}
          >
            <img src={channel.thumbnail} width={60} height={60} alt={channel.title} />
            <div>
              <h3 style={{ margin: 0 }}>{channel.title}</h3>
              <p style={{ margin: 0, fontSize: '0.9em' }}>{channel.description || 'Tanpa deskripsi'}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
