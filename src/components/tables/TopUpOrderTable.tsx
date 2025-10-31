"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

type Transaction = {
    id: string;
    transactionId: string;
    amount: string;
    status: string;
    paymentGateway: string;
};

type Country = {
    id: string;
    name: string;
    isoCode: string;
    phoneCode: string;
};

type TopUpOrder = {
    id: string;
    orderCode: string;
    name: string;
    email: string;
    totalAmount: string;
    currency: string;
    status: string;
    activated: boolean;
    createdAt: string;
    country: Country;
    transaction: Transaction;
    type: string;
};

type Props = {
    topUpOrders: TopUpOrder[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TopUpOrdersTable: any = ({ topUpOrders }) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;

    const filteredOrders = useMemo(() => {
        const search = globalFilter.toLowerCase();
        return topUpOrders.filter(
            (order) =>
                order.orderCode.toLowerCase().includes(search) ||
                order.name.toLowerCase().includes(search) ||
                order.email.toLowerCase().includes(search) ||
                order.country?.name.toLowerCase().includes(search) ||
                order.transaction?.transactionId?.toLowerCase().includes(search)
        );
    }, [topUpOrders, globalFilter]);

    const pageCount = Math.ceil(filteredOrders.length / pageSize);
    const paginatedOrders = filteredOrders.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
    );

    const handlePrev = () => pageIndex > 0 && setPageIndex(pageIndex - 1);
    const handleNext = () => pageIndex < pageCount - 1 && setPageIndex(pageIndex + 1);

    return (
        <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-700">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value);
                            setPageIndex(0);
                        }}
                        placeholder="Search top-up orders..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Order Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Country
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Activated
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {paginatedOrders.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-400 text-sm">
                                    No matching top-up orders found
                                </td>
                            </tr>
                        )}
                        {paginatedOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-800/50 transition">
                                <td className="px-6 py-4 text-gray-300 font-mono">{order.orderCode}</td>
                                <td className="px-6 py-4 text-gray-300">
                                    {order.name}
                                    <div className="text-xs text-gray-400">{order.email}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">{order.country?.name}</td>
                                <td className="px-6 py-4 text-gray-400">
                                    {order.totalAmount} {order.currency}
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {order.transaction?.paymentGateway ?? "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "COMPLETED"
                                                ? "bg-green-100 text-green-800"
                                                : order.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {order.activated ? (
                                        <span className="text-green-400 font-semibold">Yes</span>
                                    ) : (
                                        <span className="text-red-400">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {new Date(order.createdAt).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link
                                        href={`/admin/orders/top-up/${order.id}`}
                                        className="p-2 rounded hover:bg-gray-700 cursor-pointer transition"
                                        aria-label="View Order"
                                    >
                                        <FaEye className="h-5 w-5 text-blue-400 hover:text-white" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    Showing {pageIndex * pageSize + 1}–
                    {Math.min((pageIndex + 1) * pageSize, filteredOrders.length)} of{" "}
                    {filteredOrders.length}
                </span>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={handlePrev}
                        disabled={pageIndex === 0}
                        className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-400">
                        Page {pageIndex + 1} of {pageCount}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={pageIndex >= pageCount - 1}
                        className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopUpOrdersTable;
