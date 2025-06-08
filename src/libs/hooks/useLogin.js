import { useState } from "react";
import { BASE_API } from "@/libs/environtment";

export const useLogin = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleLogin = () => {
    window.location.href = `${BASE_API}/login`; // Redirect ke backend login (OAuth / dst.)
  };

  return {
    isOpen,
    onOpen,
    onClose,
    handleLogin,
  };
};
