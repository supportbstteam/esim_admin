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
import { FiTrash2 } from "react-icons/fi";

export type Query = {
    id: string;
    queryId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    createdAt: string;
    updatedAt: string;
};

interface Props {
    queries: Query[];
    onChangeStatus: (queryId: string, status: Query["status"]) => void;
    onDeleteQuery: (queryId: string) => void;
}

const columnHelper = createColumnHelper<Query>();

const getStatusColor = (status: Query["status"]) => {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800";
        case "IN_PROGRESS":
            return "bg-blue-100 text-blue-800";
        case "RESOLVED":
            return "bg-green-100 text-green-800";
        case "CLOSED":
            return "bg-gray-300 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const QueryTable: React.FC<Props> = ({ queries, onChangeStatus, onDeleteQuery }) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = useMemo(
        () => [
            // ✅ Query ID
            columnHelper.accessor("queryId", {
                header: "Query ID",
                cell: (info) => (
                    <span className="font-mono text-blue-400">{info.getValue() || "-"}</span>
                ),
            }),

            // ✅ Combined Name column
            columnHelper.display({
                id: "name",
                header: "Name",
                cell: (info) => {
                    const { firstName, lastName } = info.row.original;
                    return <span className="text-white font-medium">{`${firstName} ${lastName}`}</span>;
                },
            }),

            // ✅ Email
            columnHelper.accessor("email", {
                header: "Email",
                cell: (info) => (
                    <span className="text-blue-400 font-mono truncate max-w-xs">
                        {info.getValue()}
                    </span>
                ),
            }),

            // ✅ Phone
            columnHelper.accessor("phone", {
                header: "Phone",
                cell: (info) => (
                    <span className="text-gray-300 font-mono">{info.getValue()}</span>
                ),
            }),

            // ✅ Shortened Message
            columnHelper.accessor("message", {
                header: "Message",
                cell: (info) => {
                    const msg = info.getValue();
                    const short = msg.length > 10 ? msg.slice(0, 10) + "..." : msg;
                    return <span className="text-gray-400">{short}</span>;
                },
            }),

            // ✅ Status
            columnHelper.accessor("status", {
                header: "Status",
                cell: (info) => (
                    <select
                        value={info.getValue()}
                        onChange={(e) => {
                            return onChangeStatus(info.row.original.id, e.target.value as Query["status"])
                        }
                        }
                        className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${getStatusColor(
                            info.getValue()
                        )}`}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                ),
            }),

            // ✅ Only Date (DD Mon YYYY)
            columnHelper.accessor("createdAt", {
                header: "Date",
                cell: (info) => (
                    <span className="text-gray-300">
                        {new Date(info.getValue()).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                ),
                sortingFn: "datetime",
            }),

            // ✅ Actions
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDeleteQuery(row.original.queryId)}
                            className="p-2 rounded hover:bg-red-700 transition cursor-pointer"
                            aria-label="Delete Query"
                            type="button"
                        >
                            <FiTrash2 className="h-5 w-5 text-red-400 hover:text-white" />
                        </button>
                    </div>
                ),
            }),
        ],
        [onChangeStatus, onDeleteQuery]
    );

    const table = useReactTable({
        data: queries,
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
        <div className="w-full mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">
            {/* Search */}
            <div className="p-4 border-b border-gray-700">
                <div className="relative">
                    <input
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search queries..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f]"
                    />
                    <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
            </div>

            {/* Table */}
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
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-800/50 transition">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${cell.column.id === "actions" ? "cursor-pointer hover:bg-gray-800/70" : ""
                                            }`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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
                        className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-400">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QueryTable;
