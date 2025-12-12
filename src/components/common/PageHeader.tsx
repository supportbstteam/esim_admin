"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  addButtonText?: string;
  addButtonRoute?: string;
  showAddButton?: boolean;
  showBackButton?: boolean;
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
      {/* Title */}
      <h2 className="text-2xl font-semibold text-[#16325d]">{title}</h2>

      {/* Right side buttons */}
      <div className="flex items-center gap-3">
        {showAddButton && (
          <button
            className="rounded cursor-pointer px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] transition focus:outline-none"
            onClick={() => {
              if (addButtonRoute) router.push(addButtonRoute);
            }}
          >
            {addButtonText}
          </button>
        )}

        {showBackButton && (
          <button
            className="rounded cursor-pointer px-5 py-2 text-[#16325d] border border-[#16325d] hover:bg-[#16325d] hover:text-white transition focus:outline-none"
            onClick={() => router.back()}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
