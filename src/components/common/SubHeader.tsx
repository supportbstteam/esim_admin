"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addButtonText?: any;
  addButtonRoute?: string; // optional route for Add button
  showAddButton?: boolean;
  showBackButton?: boolean;
  disable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: any;
}

const SubHeader: React.FC<PageHeaderProps> = ({
  title,
  disable,
  addButtonText = "+ Add",
  showAddButton = true,
  showBackButton = true,
  onClick,
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Title on left */}
      <h2 className="text-2xl font-semibold text-[#16325d]">{title}</h2>

      {/* Right side buttons */}
      <div className="flex items-center gap-3">
        {showAddButton && (
          <button
            disabled={disable}
            className={`rounded px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none transition ${
              disable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={onClick}
          >
            {addButtonText}
          </button>
        )}

        {showBackButton && (
          <button
            className="rounded px-5 py-2 cursor-pointer text-[#16325d] border border-[#16325d] hover:bg-[#16325d] hover:text-white transition focus:outline-none"
            onClick={() => router.back()}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default SubHeader;
