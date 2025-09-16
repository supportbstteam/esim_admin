"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

// Custom animated gradient effect, with glow + border
export default function CustomButton({
  children,
  variant = "primary",
  className = "",
  ...rest
}: CustomButtonProps) {
  const baseClasses =
    "px-7 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden";

  const variantClasses =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none before:absolute before:inset-0 before:rounded-xl before:opacity-70 before:blur-lg before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 hover:before:opacity-90 hover:scale-105 hover:shadow-2xl focus:ring-purple-400"
      : "bg-white text-gray-900 border border-gradient-to-r border-blue-400 border-pink-400 hover:bg-gray-100 focus:ring-gray-400";

  // Custom animation for the gradient background
  const customStyle: React.CSSProperties =
    variant === "primary"
      ? {
          backgroundSize: "200% 200%",
          animation: "gradient-move 3s ease-in-out infinite",
          position: "relative",
        }
      : {};

  return (
    <button
      style={customStyle}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
