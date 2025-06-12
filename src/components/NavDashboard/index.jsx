import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { FiYoutube } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import Image from "next/image";

const NavDashboard = () => {
  return (
    <nav className="w-full flex flex-row items-center justify-between bg-slate-50 rounded-lg py-4 px-6 shadow-lg shadow-red-800/20">
      <div className="flex items-center gap-2">
         <Image
              alt="Logo"
              src="/logo/logo.png"
              width={45}
              height={50}
            />
        <h1 className="text-2xl font-semibold bg-gradient-to-br from-red-200 to-red-800 bg-clip-text text-transparent">HAJAR ENTERPRISE</h1>
      </div>
      <div className="sm:hidden">
        <Dropdown>
          <DropdownTrigger>
            <RxHamburgerMenu className="cursor-pointer" size={20} />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" className="p-2">
            <DropdownItem 
              key="Home"
              as={Link}
              href="/dashboard"
              startContent={<FaHome size={22} />}
              className="mb-2 rounded-lg"
            >
              Home
            </DropdownItem>
            <DropdownItem 
              key="Video"
              as={Link}
              href="/dashboard/video"
              startContent={<FiYoutube size={22} />}
              className="mb-2 rounded-lg"
            >
              Video
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default NavDashboard;