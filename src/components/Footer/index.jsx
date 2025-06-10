import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 f">
        <div className="md:flex md:justify-between">
          <div id="footer">
            <div className="flex items-center mb-4 gap-2">
              <Image alt="Logo" src="/logo/logo.png" width={45} height={50} />
              <h2 className="text-xl font-bold">Hajar</h2>
            </div>
            <p className="text-white text-sm leading-relaxed max-w-xs">
              Menjaga komentar Youtube tetap bersih dan bermakna
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-3 mt-8 xl:mt-2">
            <div className="flex flex-col gap-4">
              <h1>REPOSITORIES</h1>
              <Link
                href="https://github.com/hajar-enterprise"
                className="hover:underline text-gray-400 text-sm"
              >
                Github
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <h1>Developers</h1>
              <Link
                href="https://github.com/orgs/HAJAR-Enterprise/people"
                className="hover:underline text-gray-400 text-sm"
              >
                Our Team
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <h1>LEGAL</h1>
              <Link href="#" className="hover:underline text-gray-400 text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:underline text-gray-400 text-sm">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-500 my-10"></div>
        <div className="text-center">
          <p className="text-white text-sm">
            © 2025 HAJAR Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
