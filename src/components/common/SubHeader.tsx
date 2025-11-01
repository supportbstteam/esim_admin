"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

interface PageHeaderProps {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addButtonText?: any;
    addButtonRoute?: string; // optional route for Add button
    showAddButton?: boolean;
    showBackButton?: boolean;
    disable?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: any
}

const SubHeader: React.FC<PageHeaderProps> = ({
    title,
    disable,
    addButtonText = "+ Add",
    showAddButton = true,
    showBackButton = true,
    onClick
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
                            onClick={onClick}
                        />
                    )
                }
                <h2 className="text-2xl font-semibold text-[#16325d]">{title}</h2>
            </div>

            {/* Add Button */}
            {showAddButton && (
                <button
                    disabled={disable}
                    className="rounded cursor-pointer px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none"
                    onClick={onClick}
                >
                    {addButtonText}
                </button>
            )}
        </div>
    );
};

export default SubHeader;
