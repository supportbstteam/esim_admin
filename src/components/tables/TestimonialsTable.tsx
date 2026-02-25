"use client";

import React, { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { Toggle } from "../ui/Toggle";
import {
    Testimonial,
    clearTestimonial,
    deleteTestimonial,
    updateTestimonial,
    updateTestimonialStatus,
} from "@/store/slice/testimonialsSlice";
import { ddmmyyyy } from "@/utils/dateTime";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columnHelper = createColumnHelper<any>();

const TestimonialsTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { testimonials, loading } = useAppSelector((state) => state.testimonials);

    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selected, setSelected] = useState<Testimonial | null>(null);
    const [showModal, setShowModal] = useState(false);

    // 🗑️ Delete handler
    const handleDelete = async () => {
        try {
            if (!selected?.id) return;
            await dispatch(deleteTestimonial(selected.id)).unwrap();
            // toast.success("Testimonial deleted successfully!");
            setShowModal(false);
        } catch {
            toast.error("Failed to delete testimonial");
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleToggleActive = async (testimonial: any) => {
        try {
            await dispatch(
                updateTestimonialStatus({
                    id: testimonial.id,
                    isActive: !testimonial.isActive
                    // data: { ...testimonial, isActive: !testimonial.isActive },
                })
            ).unwrap();
        } catch {
            toast.error("Failed to update testimonial status");
        }
    };

    // 🧱 Columns
    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "Name",
                cell: (info) => (
                    <span className="font-medium text-white">{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor("profession", {
                header: "Profession",
                cell: (info) => (
                    <span className="text-gray-300">{info.getValue() || "-"}</span>
                ),
            }),
            columnHelper.accessor("content", {
                header: "Content",
                cell: (info) => (
                    <div className="text-gray-300 line-clamp-2 max-w-xs">
                        {info.getValue().length > 10 ? `${info.getValue().slice(0, 30)}...` : info.getValue()}
                    </div>
                ),
            }),
            columnHelper.accessor("createdAt", {
                header: "Created At",
                cell: (info) => (
                    <span className="text-gray-400">
                        {ddmmyyyy(info.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor("isActive", {
                header: "Active",
                cell: ({ row }) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const testimonial: any = row.original;
                    return (
                        <div className="flex justify-center">
                            <Toggle
                                checked={testimonial.isActive}
                                onChange={() => handleToggleActive(testimonial)}
                            />
                        </div>
                    );
                },
            }),
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={async() =>{
                                // dispatch(clearTestimonial())
                                return router.push(`/admin/testimonials/manage?mode=update&id=${row.original.id}`)
                            }}
                            className="p-2 cursor-pointer rounded hover:bg-gray-700 transition"
                            aria-label="Edit testimonial"
                        >
                            <FiEdit className="h-5 w-5 text-gray-400 hover:text-white" />
                        </button>
                        <button
                            onClick={() => {
                                setSelected(row.original);
                                setShowModal(true);
                            }}
                            className="p-2 cursor-pointer rounded hover:bg-red-700 transition"
                            aria-label="Delete testimonial"
                        >
                            <FiTrash2 className="h-5 w-5 text-red-400 hover:text-white" />
                        </button>
                    </div>
                ),
            }),
        ],
        [router]
    );

    // ⚙️ Table Setup
    const table = useReactTable({
        data: testimonials || [],
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    // if (loading)
    //     return <div className="text-center text-gray-400 py-6">Loading testimonials...</div>;

    return (
        <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">
            {/* 🔍 Search */}
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
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search testimonials..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f]"
                    />
                </div>
            </div>

            {/* 🧱 Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-black/20"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                ),
                                                desc: (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                ),
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-800/50 transition">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm text-gray-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center text-gray-400 py-6">
                                    No testimonials found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 📄 Pagination */}
            <div className="px-6 py-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    Showing{" "}
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-2 text-gray-400 cursor-pointer hover:text-white disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-400">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-2 text-gray-400 cursor-pointer hover:text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* 🗑️ Confirm Delete Modal */}
            <ConfirmDeleteModal
                open={showModal}
                onClose={() => setShowModal(false)}
                operatorName={selected?.name}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default TestimonialsTable;
