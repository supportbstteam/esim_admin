"use client";

import "../app/globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ThemeProvider from "@/providers/ThemeProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import { useAppSelector } from "@/store";
import { useState } from "react";

export default function RootLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAppSelector((state) => state.user);

  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 duration-100
        ${collapsed ? "w-16" : "w-64"}`}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {/* Main content */}
     <div
  className={`flex flex-col  ${
    collapsed
      ? "w-[calc(100%-64px)]"
      : "w-[calc(100%-256px)]"
  }`}
>
        {/* Navbar */}
        <header className="flex-shrink-0 animate-fade-slide-in-down">
          <Navbar toggleSidebar={toggleSidebar} collapsed={collapsed} />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto scrollbar-hide">
          {children}
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}
