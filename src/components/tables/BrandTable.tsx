"use client";

import React, { useEffect, useMemo, useState } from "react";
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

import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "@/store";
import {
    fetchBrands,
    disableBrand,
    restoreBrand,
    deleteBrand,
} from "@/store/slice/brands/brandThunks";

import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { Toggle } from "../ui/Toggle";
import { Brand } from "@/lib/types";

const columnHelper = createColumnHelper<Brand>();

export default function BrandTable() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { list } = useAppSelector((s) => s.brands);

    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        await dispatch(deleteBrand(deleteTarget.id));
        setDeleting(false);
        setDeleteTarget(null);
    };

    // ===== Columns =====
    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "Brand Name",
                cell: info => (
                    <div className="text-white font-medium">
                        {info.getValue()}
                    </div>
                ),
            }),

            columnHelper.accessor("createdAt", {
                header: "Created",
                cell: info => (
                    <span className="text-gray-400 text-xs">
                        {new Date(info.getValue()).toLocaleDateString()}
                    </span>
                ),
                sortingFn: "datetime",
            }),

            columnHelper.accessor("isActive", {
                header: "Active",
                cell: info => (
                    <Toggle
                        checked={info.getValue()}
                        onChange={(val) => {
                            const id = info.row.original.id;

                            dispatch(
                                val ? restoreBrand(id) : disableBrand(id)
                            );
                        }}
                    />
                ),
            }),

            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">

                        {/* Edit */}
                        <button
                            onClick={() =>
                                router.push(`/admin/compatible/brands/edit/${row.original.id}`)
                            }
                            className="p-2 rounded hover:bg-gray-700 transition"
                        >
                            <FiEdit className="h-5 w-5 text-gray-400 hover:text-white" />
                        </button>

                        {/* Hard Delete */}
                        <button
                            onClick={() => setDeleteTarget(row.original)}
                            className="p-2 rounded hover:bg-red-700 transition"
                        >
                            <FiTrash2 className="h-5 w-5 text-red-400 hover:text-white" />
                        </button>

                    </div>
                ),
            }),
        ],
        [dispatch, router]
    );

    const table = useReactTable({
        data: list,
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

    return (
        <>
            <ConfirmDeleteModal
                open={!!deleteTarget}
                loading={deleting}
                operatorName={deleteTarget?.name}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />

            <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">

                {/* Search */}
                <div className="p-4 border-b border-gray-700">
                    <input
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search brands..."
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#37c74f]"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="
            px-6 py-3
            text-left
            text-xs
            font-semibold
            text-white
            uppercase
            tracking-wider
            cursor-pointer
            align-middle
            whitespace-nowrap
          "
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody className="divide-y divide-gray-700">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-800/50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-3 border-t border-gray-700 flex justify-between text-gray-400">
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Prev
                    </button>

                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>

                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
