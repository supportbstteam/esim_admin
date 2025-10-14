import React from "react";

type CardProps = {
  title: string;
  children: React.ReactNode;
  contentClassName?: string; // Optional additional styling for content wrapper
};

export const Card: React.FC<CardProps> = ({ title, children, contentClassName }) => (
  <div className="bg-white rounded-lg w-full shadow p-6 mb-8">
    <h2 className="text-xl text-black font-semibold mb-4 border-b pb-2">{title}</h2>
    <div className={contentClassName}>{children}</div>
  </div>
);
