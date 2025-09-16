"use client";

import { useSelector } from "react-redux";
import AuthLayout from "@/layouts/AuthLayout";
import RootLayoutInner from "./RootLayout";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: any) => state.user);

  return isAuthenticated ? (
    <RootLayoutInner>{children}</RootLayoutInner>
  ) : (
    <AuthLayout>{children}</AuthLayout>
  );
}
