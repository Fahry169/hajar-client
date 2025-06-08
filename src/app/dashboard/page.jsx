"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/libs/withAuth";
import { Button } from "@heroui/react";

function Page() {
  const router = useRouter();

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

          <Button
            onPress={() => logout(router)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
