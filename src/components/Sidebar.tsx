"use client";

import { FiHome, FiUsers, FiLayers, FiSettings } from "react-icons/fi";
import { FiCpu } from "react-icons/fi"; // added different icon for esim
import { FiMapPin } from "react-icons/fi"; // for country
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "@/store/slice/userSlice";

export default function Sidebar() {
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
    <aside className="w-64 h-full bg-red dark:bg-gray-800  shadow-lg flex flex-col">
      <div className="pt-2 border-b  dark:border-gray-700">
        <Image src="/FullLogo.png" alt="Logo" width={150} height={150} className="mx-auto mb-4 rounded-2xl" />
      </div>
      <nav className="flex-1 p-4 space-y-3">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiHome /> Dashboard
        </Link>

        <Link
          href="/admin/users"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiUsers /> Customers
        </Link>

        {/* <Link
          href="/admin/esim"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiCpu /> E-Sims
        </Link> */}

        {/* <Link
          href="/admin/operators"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiMapPin /> Operators
        </Link> */}

        <Link
          href="/admin/country"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiMapPin /> Country
        </Link>

        <Link
          href="/admin/plans"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiLayers /> Plans
        </Link>

        <Link
          href="/admin/orders"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiLayers /> Orders
        </Link>

        <Link
          href="/admin/cms"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiLayers /> CMS
        </Link>

        <Link
          href="/admin/topup"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiLayers /> Top-up
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiSettings /> Settings
        </Link>
      </nav>
    </aside>
  );
}
