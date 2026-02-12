"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  return null;
}
