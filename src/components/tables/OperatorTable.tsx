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

interface Country {
  _id: string;
  name: string;
  isoCode: string;
  phoneCode: string;
}

interface Operator {
  _id: string;
  name: string;
  code: string;
  isActive: boolean;
  countries: Country[];
}

interface OperatorsTableProps {
  operatorData: Operator[];
  onEdit: (operator: Operator) => void;
  onDelete: (operatorId: string) => void;
}

// ✅ Custom Tailwind Badge
const Badge: React.FC<{ label: string; variant?: "success" | "inactive" | "default" }> = ({
  label,
  variant = "default",
}) => {
  const styles = {
    default: "bg-[#16325d] text-white",
    success: "bg-green-600 text-white",
    inactive: "border border-gray-400 text-gray-300",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}
    >
      {label}
    </span>
  );
};

const OperatorsTable: React.FC<OperatorsTableProps> = ({ operatorData, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Operator>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => <div className="font-medium text-white">{info.getValue()}</div>,
      }),
      columnHelper.accessor("countries", {
        header: "Countries",
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {info.getValue().map((c, idx) => (
              <Badge key={idx} label={`${c.name} (${c.isoCode})`} />
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("code", {
        header: "Code",
        cell: (info) => <div className="text-[#37c74f] font-medium">{info.getValue()}</div>,
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) =>
          info.getValue() ? (
            <Badge label="Active" variant="success" />
          ) : (
            <Badge label="Inactive" variant="inactive" />
          ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const operator = row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(operator)}
                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                title="Edit"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(operator._id)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Delete"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          );
        },
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: operatorData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search operators..."
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f] focus:border-transparent"
        />
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
        <span className="text-sm text-gray-400">
          Showing{" "}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
            >
              ⏮
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
            >
              ◀
            </button>
            <span className="px-3 py-1 text-sm text-gray-400">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
            >
              ▶
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorsTable;
