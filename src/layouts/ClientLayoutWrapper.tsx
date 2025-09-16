"use client";

import { useSelector } from "react-redux";
import AuthLayout from "@/layouts/AuthLayout";
import RootLayoutInner from "./RootLayout";
// import Loader from "@/components/loader";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAuthenticated } = useSelector((state: any) => state.user);

  // console.log("---- loading ---", isLoading);

  // if (isLoading)
  //   return <Loader />

  return isAuthenticated ? (
    <RootLayoutInner>{children}</RootLayoutInner>
  ) : (
    <AuthLayout>{children}</AuthLayout>
  );
}
