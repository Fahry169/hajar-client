import { useLogin } from "@/libs/hooks/useLogin";
import { Button } from "@heroui/react";
import { LoginModal } from "../LoginModal";

const Hero = () => {
  const { isOpen, onOpen, onClose, handleLogin } = useLogin();

  return (
    <div className="bg-hero -mt-16 min-h-screen flex" id="hero">
      <div className="flex flex-col items-center justify-center w-full gap-5 px-4 sm:px-6 lg:px-8 p-48">
        <h1 className="text-5xl sm:text-6xl font-bold text-center">HAJAR</h1>
        <h1 className="text-4xl sm:text-6xl font-bold  text-center leading-tight">
          Hapus <span className="text-red-600"> Judi </span>Anti Ribet
        </h1>
        <p className="text-gray-700 text-center text-sm sm:text-base lg:text-lg max-w-md sm:max-w-lg lg:max-w-xl px-4">
          Jangan Biarkan Komentar{" "}
          <span className="text-red-700">Judi Online </span>Merusak Video
          Youtube Anda
        </p>
        <div className="mt-4">
          <Button
            onPress={onOpen}
            className="w-48 sm:w-56 lg:w-60  bg-red-500 text-white font-semibold py-6 text-sm sm:text-base"
          >
            HAJAR Sekarang
          </Button>
        </div>
      </div>

      <LoginModal isOpen={isOpen} onClose={onClose} handleLogin={handleLogin} />
    </div>
  );
};

export default Hero;
