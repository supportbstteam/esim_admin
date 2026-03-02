"use client";

import React, { useState, useMemo } from "react";
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
import { FiEdit, FiTrash2, FiCopy } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { useAppDispatch, useAppSelector } from "@/store";
import { deleteImage } from "@/store/slice/mediaSlice";
import { ddmmyyyy } from "@/utils/dateTime";
import CommonTableSkeleton from "../skeletons/CommonTableSkeleton";
import { joinUrl } from "@/lib/joinUrl";

interface ImageType {
    id: number;
    name?: string;
    originalName: string;
    filePath: string;
    createdAt: string;
}

const columnHelper = createColumnHelper<ImageType>();

const MediaTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { images, loading } = useAppSelector((state) => state.media);

    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selected, setSelected] = useState<ImageType | null>(null);
    const [showModal, setShowModal] = useState(false);

    // 🗑️ Delete handler
    const handleDelete = async () => {
        try {
            if (!selected?.id) return;
            await dispatch(deleteImage(selected.id)).unwrap();
            toast.success("Image deleted successfully!");
            setShowModal(false);
        } catch {
            toast.error("Failed to delete image");
        }
    };

    // 📋 Copy URL handler
    const handleCopy = async (fullUrl: string) => {
        try {
            if (!fullUrl) {
                toast.error("Invalid image URL");
                return;
            }

            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(fullUrl);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = fullUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }

            toast.success("Image URL copied!");
        } catch {
            toast.error("Failed to copy URL");
        }
    };

    // 🧱 Table Columns
    const columns = useMemo(
        () => [
            columnHelper.accessor("filePath", {
                header: "Preview",
                cell: (info) => {
                    const fullUrl = info.getValue()
                        ? joinUrl(
                            process.env.NEXT_PUBLIC_API_URL!,
                            info.getValue()
                        )
                        : "";

                    return (
                        <img
                            src={fullUrl}
                            alt="media"
                            className="w-14 h-14 object-cover rounded"
                        />
                    )
                },
            }),
            columnHelper.accessor("name", {
                header: "Name",
                cell: (info) => (
                    <span className="text-white font-medium">
                        {info.getValue() || info.row.original.name || info.row.original.originalName || "No Name"}
                    </span>
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
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const image = row.original;

                    const fullUrl = image.filePath
                        ? joinUrl(
                            process.env.NEXT_PUBLIC_API_URL!,
                            image.filePath
                        )
                        : "";

                    return (
                        <div className="flex items-center gap-2">
                            {/* Copy URL */}
                            <button
                                onClick={() => handleCopy(fullUrl)}
                                className="p-2 rounded cursor-pointer hover:bg-gray-700 transition"
                            >
                                <FiCopy className="h-5 w-5 text-gray-400 hover:text-white" />
                            </button>

                            {/* Edit */}
                            <button
                                onClick={() =>
                                    router.push(`/admin/media/edit/${image.id}`)
                                }
                                className="p-2 rounded cursor-pointer hover:bg-gray-700 transition"
                            >
                                <FiEdit className="h-5 w-5 text-gray-400 hover:text-white" />
                            </button>

                            {/* Delete */}
                            <button
                                onClick={() => {
                                    setSelected(image);
                                    setShowModal(true);
                                }}
                                className="p-2 rounded cursor-pointer hover:bg-red-700 transition"
                            >
                                <FiTrash2 className="h-5 w-5 text-red-400 hover:text-white" />
                            </button>
                        </div>
                    );
                },
            }),
        ],
        [router]
    );

    const table = useReactTable({
        data: images || [],
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

    if (loading)
        return (
            <CommonTableSkeleton
                columns={4}
                rows={10}
                showSearch={true}
            />
        );

    return (
        <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">
            {/* 🔍 Search */}
            <div className="p-4 border-b border-gray-700">
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search media..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
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
                                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-800/50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center text-gray-400 py-6"
                                >
                                    No media found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 📄 Pagination */}
            <div className="px-6 py-3 border-t border-gray-700 flex justify-between">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-gray-400">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <ConfirmDeleteModal
                open={showModal}
                onClose={() => setShowModal(false)}
                operatorName={selected?.name || selected?.originalName}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default MediaTable;