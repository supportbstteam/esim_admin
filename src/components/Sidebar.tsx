"use client";

import { FiHome, FiUsers, FiLayers, FiSettings } from "react-icons/fi";
import { FiCpu } from "react-icons/fi"; // added different icon for esim
import { FiMapPin } from "react-icons/fi"; // for country
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-red dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 font-bold text-lg border-b dark:border-gray-700">
        Dashboard
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
          <FiUsers /> Users
        </Link>

        <Link
          href="/admin/esim"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiCpu /> E-Sims
        </Link>

        <Link
          href="/admin/operators"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiMapPin /> Operators
        </Link>

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
          href="/admin/settings"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiSettings /> Settings
        </Link>
      </nav>
    </aside>
  );
}
