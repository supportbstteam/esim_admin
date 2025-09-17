"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "@/store/slice/userSlice";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: any = useDispatch();
  const isActive = (path: string) => pathname === path;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.user);

  // console.log("---- isauthenticated navbar ----", user)

  const handleLogout = async () => {
    await dispatch(logout())
    await dispatch(checkAuth());
    router.push('/')
  };

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(checkAuth());
    };
    fetchUser();
  }, []);

  return (
    <header
      className="
        w-full h-16 
        sticky top-0 z-50 
        backdrop-blur-md bg-opacity-90 
        bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        shadow-lg
        flex items-center justify-between px-8
      "
    >
      <h1
        className="
          text-xl font-extrabold 
          text-gray-800 dark:text-gray-100 
          cursor-default select-none 
          drop-shadow-md
        "
      >
        eSIM Admin Panel
      </h1>

      <nav className="flex items-center space-x-10">
        {/* {[
          { label: "Home", path: "/" },
          { label: "About", path: "/about" },
          { label: "Contact", path: "/contact" },
          { label: "Support", path: "/support" },
        ].map(({ label, path }) => (
          <Link
            key={path}
            href={path}
            className={`
              relative 
              font-semibold tracking-wide
              text-gray-700 dark:text-gray-300
              py-1 px-3 rounded-md
              transition-all duration-300 ease-in-out 
              bg-gradient-to-r from-transparent to-transparent
              ${isActive(path)
                ? "text-white dark:text-white bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-lg"
                : "hover:text-white dark:hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:via-purple-500 hover:to-pink-500"
              }
              active:scale-95
            `}
          >
            {label}
          </Link>
        ))} */}

        {/* ✅ Login/Logout Button */}
        {!user?.isAuthenticated ? (
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}

        {/* <ThemeToggle /> */}
      </nav>
    </header>
  );
}
