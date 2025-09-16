"use client";
import { InputHTMLAttributes, useState } from "react";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function CustomInput({ className = "", ...rest }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative rounded-md transition-all duration-300 p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${
        isFocused ? "opacity-100" : "opacity-40"
      }`}
    >
      <input
        {...rest}
        onFocus={(e) => {
          setIsFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          rest.onBlur?.(e);
        }}
        className={`w-full rounded-md border-none px-3 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${className}`}
      />
    </div>
  );
}
