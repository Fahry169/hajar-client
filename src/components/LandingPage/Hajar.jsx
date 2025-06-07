import { useLogin } from "@/libs/hooks/useLogin";
import { Button } from "@heroui/react";
import { LoginModal } from "../LoginModal";

const Hajar = () => {
  const { isOpen, onOpen, onClose, handleLogin } = useLogin();

  return (
    <div className="bg-hajar h-screen flex" id="hajar">
      <div className="flex flex-col items-center justify-center w-full gap-3 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-semibold text-center">
          Tertarik Mencoba ?
        </h1>
        <h1 className="text-4xl sm:text-5xl font-semibold text-center">
          Langsung HAJAR Aja!
        </h1>
        <div>
          <Button
            onPress={onOpen}
            className="w-48 sm:w-56 lg:w-60 font-semibold bg-blue-600 py-6 text-white sm:text-base mt-10"
          >
            HAJAR Sekarang
          </Button>
        </div>
      </div>

      <LoginModal isOpen={isOpen} onClose={onClose} handleLogin={handleLogin} />
    </div>
  );
};

export default Hajar;
