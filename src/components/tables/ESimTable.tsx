"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaTrash, FaEye } from "react-icons/fa";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import toast from "react-hot-toast";
import moment from "moment";
import { ddmmyyyy } from "@/utils/dateTime";
import { useAppDispatch } from "@/store";
import { deleteESim } from "@/store/slice/eSimSlice";

// Type your eSIM data as needed
type ESim = {
    id: string;
    iccid?: string;
    productName: string;
    dataAmount: number;
    price: string;
    currency: string;
    statusText: string;
    isActive: boolean;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
};

type Props = {
    esims: ESim[];
    onDeleteESim: () => void;
};

const ESimTable: React.FC<Props> = ({ esims, onDeleteESim }) => {
    const dispatch = useAppDispatch();
    const [globalFilter, setGlobalFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedESim, setSelectedESim] = useState<ESim | null>(null);
    const [pageIndex, setPageIndex] = useState(0);

    const pageSize = 10;

    // Filter eSIMs by iccid, productName, user email/name
    const filteredESims = useMemo(() => {
        const search = globalFilter.toLowerCase();
        return esims.filter(esim =>
            (esim.iccid ?? "").toLowerCase().includes(search) ||
            esim.productName.toLowerCase().includes(search) ||
            esim.user.firstName.toLowerCase().includes(search) ||
            esim.user.lastName.toLowerCase().includes(search) ||
            esim.user.email.toLowerCase().includes(search)
        );
    }, [esims, globalFilter]);

    const pageCount = Math.ceil(filteredESims.length / pageSize);
    const paginatedESims = filteredESims.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
    );

    const handlePrev = () => pageIndex > 0 && setPageIndex(pageIndex - 1);
    const handleNext = () => pageIndex < pageCount - 1 && setPageIndex(pageIndex + 1);

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            dispatch(deleteESim(selectedESim?.id));
            toast.success("eSIM deleted successfully");
            onDeleteESim();
            setShowModal(false);
            setDeleteLoading(false);
        } catch (err) {
            toast.error("Something went wrong");
        }
        finally {
            setDeleteLoading(false);
        }
    };

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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={e => {
                            setGlobalFilter(e.target.value);
                            setPageIndex(0);
                        }}
                        placeholder="Search eSIMs..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ICCID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Activated</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {paginatedESims.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-400 text-sm">
                                    No matching eSIMs found
                                </td>
                            </tr>
                        )}
                        {paginatedESims.map(esim => {
                            // console.log("----- esim in pagination ----", esim);
                            return esim?.dataAmount !== null && (
                                <tr key={esim.id} className="hover:bg-gray-800/50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">{(esim.iccid ?? "—").slice(0, 16)}</td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {esim.user?.firstName + " " + esim.user?.lastName || "User Deleted"}
                                        <div className="text-xs text-gray-400">{esim.user?.email}</div>
                                    </td>
                                    {/* <td className="px-6 py-4 text-gray-300">{esim.productName}</td> */}
                                    <td className="px-6 py-4 text-[#37c74f] font-medium">{esim.dataAmount} GB</td>
                                    <td className="px-6 py-4 text-gray-400">{esim.price} {esim.currency}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${esim.statusText === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : esim.statusText === "waiting"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {esim.statusText}
                                        </span>
                                    </td>
                                    {/* <td className="px-6 py-4">
                                        {esim.isActive ? (
                                            <span className="text-green-400 font-semibold">Yes</span>
                                        ) : (
                                            <span className="text-red-400">No</span>
                                        )}
                                    </td> */}
                                    <td className="px-6 py-4 text-gray-400">
                                        {/* {new Date(esim.createdAt).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })} */}
                                        {ddmmyyyy(esim.createdAt)}

                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Link
                                                href={`/admin/esim/${esim.id}`}
                                                className="p-2 rounded hover:bg-gray-700 cursor-pointer transition"
                                                aria-label="View eSIM"
                                            >
                                                <FaEye className="h-5 w-5 text-blue-400 hover:text-white" />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedESim(esim);
                                                    setShowModal(true);
                                                }}
                                                aria-label="Delete eSIM"
                                                className="p-2 rounded cursor-pointer hover:bg-red-700 transition"
                                            >
                                                <FaTrash className="h-5 w-5 text-red-400 hover:text-white" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    Showing {pageIndex * pageSize + 1}–
                    {Math.min((pageIndex + 1) * pageSize, filteredESims.length)} of {filteredESims.length}
                </span>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={handlePrev}
                        disabled={pageIndex === 0}
                        className="p-2  text-gray-400 hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                        Prev
                    </button>
                    <span className="text-gray-400">Page {pageIndex + 1} of {pageCount}</span>
                    <button
                        onClick={handleNext}
                        disabled={pageIndex >= pageCount - 1}
                        className="p-2 text-gray-400 hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                onClose={() => setShowModal(false)}
                open={showModal}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </div>
    );
};

export default ESimTable;
