import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useGoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { BASE_API } from '@/libs/environtment';
import { useEffect } from 'react';

export const LoginModal = ({ isOpen, onClose }) => {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get('token');
    const userId = params.get('userId');

    if (token) {
      Cookies.set('authorization', token, { expires: 1 / 24 }); // expired dalam 1 jam
      console.log('Token disimpan ke cookie');
      // Opsional: bersihkan query URL
      router.replace('/dashboard');
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = BASE_API + '/login';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Masuk ke HAJAR
              </h2>
              <p className="text-sm text-gray-600">
                Gunakan akun Google Anda untuk melanjutkan
              </p>
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="flex flex-col gap-4">
                <Button
                  className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                  startContent={
                    <Image
                      alt="Google Logo"
                      src="/icon/google-color.svg"
                      width={22}
                      height={22}
                      className="mr-2"
                    />
                  }
                  onPress={handleGoogleLogin}>
                  Masuk dengan Google
                </Button>
              </div>
            </ModalBody>
            <ModalFooter className="flex-col gap-2">
              <p className="text-xs text-gray-500 text-center">
                Dengan masuk, Anda menyetujui{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </Link>{' '}
                kami.
              </p>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="w-full">
                Batal
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
