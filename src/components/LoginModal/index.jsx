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
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { BASE_API } from '@/libs/environtment';

export const LoginModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;

        // Optionally get user info
        const userInfoRes = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const userInfo = await userInfoRes.json();
        console.log('[✅ User Info]', userInfo);

        // Send to backend
        const res = await fetch(BASE_API + '/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInfo, accessToken }),
        });

        if (res.ok) {
          const data = await res.json();

          Cookies.set('authorization', data.token, { expires: 1 / 24 }); // Store access token in cookies
          onClose(); // Close the modal after successful login
          router.push('/dashboard'); // Redirect to dashboard after login
        } else {
          alert('Failed to register user');
        }

        // Optional: redirect to dashboard router.push('/dashboard');
      } catch (error) {
        console.error(error);
        alert('Failed to login with Google');
      }
    },

    onError: (error) => {
      alert('Google login failed');
    },
    scope:
      'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/au' +
      'th/youtube.force-ssl',
  });

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
