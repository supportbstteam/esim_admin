"use client";
import { useSelector } from "react-redux";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAuthenticated, isLoading } = useSelector((state: any) => state.user);

  return (
    <>
      {!isAuthenticated ? (
        <>
          {children}
        </>
      ) : null}
    </>
  );
}
