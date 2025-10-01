import React, { useState } from "react";

// Types
type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isBlocked: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    createdAt: string;
};

type Props = {
    customers: Customer[];
    onToggleBlock: (id: string, val: boolean) => void;
    onToggleDelete: (id: string, val: boolean) => void;
};

const Toggle = ({
    checked,
    onChange,
    disabled = false,
}: {
    checked: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
}) => (
    <button
        className={`relative w-12 h-6 bg-gray-300 rounded-full p-1 transition-colors duration-200 
     ${checked ? "bg-green-500" : ""}
     ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    `}
        onClick={() => !disabled && onChange(!checked)}
        aria-pressed={checked}
        disabled={disabled}
        type="button"
    >
        <span
            className={`absolute top-0 left-0 h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-0"
                }`}
        />
    </button>
);
const CustomerTable: React.FC<Props> = ({ customers, onToggleBlock, onToggleDelete }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white text-gray-800">
                <thead className="bg-[#16325d] text-white">
                    <tr>
                        <th className="px-6 py-3">First Name</th>
                        <th className="px-6 py-3">Last Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Verified</th>
                        <th className="px-6 py-3">Blocked</th>
                        <th className="px-6 py-3">Deleted</th>
                        <th className="px-6 py-3">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((c) => (
                        <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4">{c.firstName}</td>
                            <td className="px-6 py-4">{c.lastName}</td>
                            <td className="px-6 py-4">{c.email}</td>
                            <td className="px-6 py-4">
                                {c.isVerified ? (
                                    <span className="text-green-600 font-semibold">Yes</span>
                                ) : (
                                    <span className="text-red-600">No</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <Toggle
                                    checked={c.isBlocked}
                                    onChange={(val) => onToggleBlock(c.id, val)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <Toggle
                                    checked={c.isDeleted}
                                    onChange={(val) => onToggleDelete(c.id, val)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                {new Date(c.createdAt).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTable