"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "@/store/slice/userSlice";
import {
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

import ProfileAndPasswordModal from "./modals/PasswordAndProfileModal";

interface NavbarProps {
  toggleSidebar: () => void;
  collapsed: boolean;
}

export default function Navbar({ toggleSidebar, collapsed }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: any = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setDropdownOpen(false);
  };

  const closePasswordModal = () => setIsPasswordModalOpen(false);

  const handleLogout = async () => {
    await dispatch(logout());
    await dispatch(checkAuth());
    router.push("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(checkAuth());
    };
    fetchUser();
  }, [dispatch]);

  return (
    <>
      <header
        className="
  w-full h-16 
  sticky top-0 z-50 
  backdrop-blur-md bg-opacity-90 
  bg-gradient-to-r from-gray-800 to-emerald-900 
  shadow-lg
  flex items-center justify-between px-6
"
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="text-white text-xl cursor-pointer hover:text-gray-200"
          >
            <FaBars
              className={`transition-transform duration-150 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Title */}
          <h1
            className="
            text-xl font-extrabold 
            text-white dark:text-gray-100 
            cursor-default select-none 
            drop-shadow-md
          "
          >
            eSIM Aero
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <nav className="flex items-center space-x-6 relative">
          {user?.isAuthenticated && (
            <div className="relative cursor-pointer">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 text-white hover:text-gray-200 focus:outline-none"
              >
                <FaUserCircle className="h-8 w-8" />

                <span className="hidden sm:inline">
                  {user?.user?.name || "Admin"}
                </span>

                {!dropdownOpen ? (
                  <FaChevronDown className="h-3 w-3" />
                ) : (
                  <FaChevronUp className="h-3 w-3" />
                )}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={openPasswordModal}
                    className="w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-200 hover:bg-red-600 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!user?.isAuthenticated && (
            <Link
              href="/login"
              className="px-4 py-2 cursor-pointer rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      <ProfileAndPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
      />
    </>
  );
}
