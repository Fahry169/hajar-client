import { useState } from "react";

export const login = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleLogin = () => {
    onClose();
  };
  return {
    isOpen,
    onOpen,
    onClose,
    handleLogin,
  };
};
