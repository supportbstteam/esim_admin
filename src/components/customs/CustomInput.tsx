"use client";
import { InputHTMLAttributes, useState } from "react";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function CustomInput({ className = "", ...rest }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative rounded-md transition-all duration-300 p-[2px] ${
        isFocused ? "opacity-100" : "opacity-40"
      }`}
      style={{
        background: isFocused
          ? "linear-gradient(to right, #16325d, #37c74f)"
          : "linear-gradient(to right, #16325d, #37c74f)",
      }}
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
        className={`w-full rounded-md border-transparent px-3 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${className}`}
        style={{
          border: "2px solid transparent",
          borderRadius: "0.375rem", // same as rounded-md
          backgroundClip: "padding-box", // prevent background bleed on border
        }}
      />
    </div>
  );
}
