"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
    children: ReactNode;
    className?: string; 
}

export default function InfoCard({ children, className = "" }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`
        relative overflow-hidden rounded-xl border border-transparent
        bg-gradient-to-r from-purple-600 via-pink-600 to-red-500
        dark:from-purple-800 dark:via-pink-800 dark:to-red-700
        shadow-lg
        ${className}
      `}
        >
            {/* Animated gradient background */}
            <div
                aria-hidden="true"
                className="
          absolute inset-0 
          bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
          opacity-30 dark:opacity-40
          animate-gradient-shift
          pointer-events-none
          rounded-xl
          blur-3xl
          mix-blend-overlay
          -z-10
        "
            ></div>

            {/* Linear gradient border - created with a pseudo-element inside */}
            <div className="relative z-10 p-6 bg-white  rounded-xl border border-transparent dark:border-gray-700">
                {children}
            </div>

            {/* Global styles to animate the background gradient */}
            <style jsx global>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-shift {
          background-size: 300% 300%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>
        </motion.div>
    );
}
