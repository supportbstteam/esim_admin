"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/store/slice/userSlice";

export default function Home() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state: any) => state.user);

  // Check auth when component mounts
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Handle navigation once auth state is known
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/admin/dashboard");
      } else {
        router.push("/auth");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Loader while checking auth
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full" />
      </main>
    );
  }

  return null; // no UI needed since it redirects
}
