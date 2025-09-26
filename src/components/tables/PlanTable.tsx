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

interface Plan {
  id: string;
  title: string;
  name: string;
  country: {
    name: string;
  };
  price: string;
  currency: string;
  data: string; // This is amount in GB, e.g., "1.00"
  isUnlimited: boolean;
  validityDays: number;
  isDeleted: boolean;
  call?: string;
  sms?: string;
  createdAt: string;
}

interface PlanTableProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

const columnHelper = createColumnHelper<Plan>();

const PlanTable: React.FC<PlanTableProps> = ({ plans, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("country.name", {
        header: "Country",
        cell: (info) => (
          <div className="font-medium text-white">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("title", {
        header: "Plan Name",
        cell: (info) => <div className="text-white">{info.getValue()}</div>,
      }),
      columnHelper.accessor("data", {
        header: "Data",
        cell: (info) =>
          info.row.original.isUnlimited ? (
            <div className="text-[#37c74f] font-medium">Unlimited</div>
          ) : (
            <div className="text-[#37c74f] font-medium">
              {info.getValue()} GB
            </div>
          ),
      }),
      columnHelper.accessor("validityDays", {
        header: "Validity",
        cell: (info) => (
          <div className="text-white">{info.getValue()} Days</div>
        ),
      }),
      columnHelper.accessor("call", {
        header: "Call",
        cell: (info) =>
          info.getValue() && info.getValue() !== "0.00" ? (
            <span className="px-2 py-1 bg-[#16325d] text-white rounded text-sm">{info.getValue()}</span>
          ) : (
            <span className="text-gray-400">N/A</span>
          ),
      }),
      columnHelper.accessor("sms", {
        header: "SMS",
        cell: (info) =>
          info.getValue() && info.getValue() !== "0.00" ? (
            <span className="px-2 py-1 bg-[#16325d] text-white rounded text-sm">{info.getValue()}</span>
          ) : (
            <span className="text-gray-400">N/A</span>
          ),
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => (
          <span className="px-2 py-1 bg-[#16325d] text-white rounded text-sm font-mono">
            {info.getValue()} {info.row.original.currency}
          </span>
        ),
      }),
      columnHelper.accessor("isDeleted", {
        header: "Status",
        cell: (info) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${!info.getValue()
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {!info.getValue() ? "Active" : "Deleted"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(row.original)}
              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
              title="Edit"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(row.original)}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
              title="Delete"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: plans,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900 mt-8">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search plans..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f] focus:border-transparent"
          />
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
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-black/20 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
          <tbody className="shadow-amber-50 divide-y divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-800/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Pagination Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 py-1 text-sm text-gray-400">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTable;
