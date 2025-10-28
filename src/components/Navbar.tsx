"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "@/store/slice/userSlice";
import { FaAngleDown, FaChevronDown, FaChevronUp, FaUserCircle } from "react-icons/fa";
// import ChangePasswordModal from "./modals/PasswordAndProfileModal";
import ProfileModal from "./modals/ProfileModal";
import ProfileAndPasswordModal from "./modals/PasswordAndProfileModal";
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: any = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // ✅ State for profile modal

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setDropdownOpen(false);
  };
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setDropdownOpen(false);
  };
  const closeProfileModal = () => setIsProfileModalOpen(false);

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

  const isActive = (path: string) => pathname === path;

  // console.log("---- user in the nav bar ----", user);

  return (
    <>
      <header
        className="
        w-full h-16 
        sticky top-0 z-50 
        backdrop-blur-md bg-opacity-90 
        bg-gradient-to-r from-emerald-500 to-emerald-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        shadow-lg
        flex items-center justify-between px-8
      "
      >
        <h1
          className="
          text-xl font-extrabold 
          text-white dark:text-gray-100 
          cursor-default select-none 
          drop-shadow-md
        "
        >
          E-SIM ADMIN
        </h1>

        <nav className="flex items-center space-x-6 relative">
          {/* User Icon */}
          {user?.isAuthenticated && (
            <div className="relative cursor-pointer">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 cursor-pointer text-white hover:text-gray-200 focus:outline-none"
              >
                <FaUserCircle className="h-8 w-8" />
                <span className="hidden sm:inline">{user?.user?.name || "Admin"}</span>
                {
                  !dropdownOpen ? <FaChevronDown className="h-3 w-3" /> : <FaChevronUp className="h-3 w-3" />
                }

                {/* <FaUserCircle  /> */}
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  {/* <button
                    onClick={openProfileModal}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                  >
                    Profile
                  </button> */}
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

          {/* Login button if not authenticated */}
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

      {/* Profile Modal */}

      {/* Profile and Change Password Modal */}
      <ProfileAndPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
      />
    </>
  );
}
