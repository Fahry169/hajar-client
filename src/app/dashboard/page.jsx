"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tokenFromUrl = params.get("token");
    const userId = params.get("userId");
    const existingToken = Cookies.get("authorization");

    if (tokenFromUrl) {
      Cookies.set("authorization", tokenFromUrl, { expires: 1 / 24 });
      console.log("Token dari URL disimpan ke cookie");
      router.replace("/dashboard");
      setIsLoading(false);
      return;
    }

    if (existingToken) {
      console.log("Token ditemukan di cookie, user tetap login");
      setIsLoading(false);
    } else {
      console.log("Tidak ada token, redirect ke landing page");
      router.push("/");
    }
  }, [params, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Selamat datang di Dashboard HAJAR!
          </h1>
          <p className="text-gray-600">
            Anda berhasil login dan dapat mengakses dashboard.
          </p>

          <button
            onClick={() => {
              Cookies.remove("authorization");
              router.push("/");
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
