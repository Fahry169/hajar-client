import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { BASE_API } from "@/libs/environtment";

export const useLogin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      Cookies.set("authorization", token, { expires: 1 / 24 });
      console.log("Token berhasil disimpan ke cookie");
      router.replace("/dashboard");
    }
  }, [params, router]);

  const handleLogin = () => {
    window.location.href = `${BASE_API}/login`;
  };

  return {
    isOpen,
    onOpen,
    onClose,
    handleLogin,
  };
};
