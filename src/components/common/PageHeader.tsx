"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

interface PageHeaderProps {
  title: string;
  addButtonText?: string;
  addButtonRoute?: string; // optional route for Add button
  showAddButton?: boolean;
  showBackButton?: boolean
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  addButtonText = "+ Add",
  addButtonRoute = "",
  showAddButton = true,
  showBackButton = true,
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        {
          showBackButton && (
            <FiArrowLeft
              className="text-[#16325d] text-xl cursor-pointer hover:text-[#28a23a] transition"
              onClick={() => router.back()}
            />
          )
        }
        <h2 className="text-2xl font-semibold text-[#16325d]">{title}</h2>
      </div>

      {/* Add Button */}
      {showAddButton && (
        <button
          className="rounded cursor-pointer px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none"
          onClick={() => {
            if (addButtonRoute) router.push(addButtonRoute);
          }}
        >
          {addButtonText}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
