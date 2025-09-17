"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/store/slice/userSlice";
import Loader from "@/components/loader";
import { useAppDispatch, useAppSelector } from "@/store"; // ✅ use typed hooks

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.user);

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
    return <Loader />;
  }

  return null; // no UI needed since it redirects
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any