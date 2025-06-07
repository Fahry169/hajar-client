'use client'
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get('token');
    const userId = params.get('userId');

    if (token) {
      Cookies.set('authorization', token, { expires: 1 / 24 });
      // Opsional: hapus query string agar bersih
      router.replace('/dashboard');
    } else { 
      // Jika tidak ada token, arahkan ke halaman login
      router.push('/');
    }
  }, []);

  return <div>Selamat datang di dashboard!</div>;
}
