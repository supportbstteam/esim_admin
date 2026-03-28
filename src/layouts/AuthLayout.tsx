"use client";
import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Administration",
};


export default function AuthLayout({ children }: { children: React.ReactNode }) {

   useEffect(() => {
    document.title = "Administration";
  }, []);


  return (
    // <ReduxProvider>
    //   <ThemeProvider>
    //   </ThemeProvider>
    // </ReduxProvider>
    <div className="ssds bg-[#fff] min-h-screen flex items-center justify-center ">
      <div className="w-full  p-8">
        {children}
      </div>
    </div>
  );
}
