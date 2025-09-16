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
      ? "bg-gradient-to-r from-[#16325d] via-[#284a7b] to-[#37c74f] text-white border-none before:absolute before:inset-0 before:rounded-xl before:opacity-70 before:blur-lg before:bg-gradient-to-r before:from-[#1c2c4d] before:via-[#2f5a88] before:to-[#2bc15d] hover:before:opacity-90 hover:scale-105 hover:shadow-2xl focus:ring-[#2bc15d]"
      : "bg-white text-gray-900 border border-gradient-to-r border-blue-400 border-pink-400 hover:bg-gray-100 focus:ring-gray-400";

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
