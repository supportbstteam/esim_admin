"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { checkAuth } from "@/store/slice/userSlice";
import Loader from "@/components/loader";

const PUBLIC_ROUTES = ["/auth"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { isAuthenticated, isLoading } = useAppSelector(
    (state) => state.user
  );

  // 🔹 Run auth check ONCE
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // 🔹 Redirect logic
  useEffect(() => {
    if (isLoading) return;

    // allow auth page
    if (PUBLIC_ROUTES.includes(pathname)) {
      if (isAuthenticated) {
        router.replace("/admin/dashboard");
      }
      return;
    }

    // protect everything else
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // 🔹 Block UI until auth known
  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
