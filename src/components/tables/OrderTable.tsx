"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaTrash, FaEye } from "react-icons/fa";

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orders: any[];
    onDeleteOrder: (id: string) => void;
};

const OrderTable: React.FC<Props> = ({ orders, onDeleteOrder }) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;

    // Flatten orders with their eSIMs for table display
    const flatOrders = useMemo(() => {
        return orders.flatMap(order =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            order.esims.map((esim: any) => ({
                orderId: order.id,
                user: order.user,
                createdAt: order.createdAt,
                totalAmount: order.totalAmount,
                status: order.status,
                esim,
            }))
        );
    }, [orders]);

    // Filter by orderId, user, email, or productName
    const filteredOrders = useMemo(() => {
        const search = globalFilter.toLowerCase();
        return flatOrders.filter(
            o =>
                o.orderId.toLowerCase().includes(search) ||
                o.user.firstName.toLowerCase().includes(search) ||
                o.user.lastName.toLowerCase().includes(search) ||
                o.user.email.toLowerCase().includes(search) ||
                o.esim.productName.toLowerCase().includes(search)
        );
    }, [flatOrders, globalFilter]);

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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={e => {
                            setGlobalFilter(e.target.value);
                            setPageIndex(0);
                        }}
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">eSIM</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Activated</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {paginatedOrders.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-400 text-sm">
                                    No matching orders found
                                </td>
                            </tr>
                        )}

                        {paginatedOrders.map(o => (
                            <tr key={o.esim.id} className="hover:bg-gray-800/50 transition">
                                <td className="px-6 py-4 text-sm text-gray-400 font-mono">{o.orderId.slice(0, 8)}...</td>
                                <td className="px-6 py-4 text-gray-300">
                                    {o.user.firstName} {o.user.lastName}
                                    <div className="text-xs text-gray-400">{o.user.email}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">{o.esim.productName}</td>
                                <td className="px-6 py-4 text-[#37c74f] font-medium">{o.esim.dataAmount} GB</td>
                                <td className="px-6 py-4 text-gray-400">{o.esim.price} {o.esim.currency}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${o.esim.statusText === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : o.esim.statusText === "waiting"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {o.esim.statusText}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {o.esim.isActive ? (
                                        <span className="text-green-400 font-semibold">Yes</span>
                                    ) : (
                                        <span className="text-red-400">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {new Date(o.createdAt).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <Link href={`/admin/orders/${o.orderId}`} className="p-2 rounded hover:bg-gray-700 transition" aria-label="View Order">
                                            <FaEye className="h-5 w-5 text-blue-400 hover:text-white" />
                                        </Link>
                                        <button onClick={() => onDeleteOrder(o.orderId)} aria-label="Delete Order" className="p-2 rounded hover:bg-red-700 transition">
                                            <FaTrash className="h-5 w-5 text-red-400 hover:text-white" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    Showing {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, filteredOrders.length)} of {filteredOrders.length}
                </span>
                <div className="flex gap-2 items-center">
                    <button onClick={handlePrev} disabled={pageIndex === 0} className="p-2 text-gray-400 hover:text-white disabled:opacity-50">Prev</button>
                    <span className="text-gray-400">Page {pageIndex + 1} of {pageCount}</span>
                    <button onClick={handleNext} disabled={pageIndex >= pageCount - 1} className="p-2 text-gray-400 hover:text-white disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default OrderTable;
