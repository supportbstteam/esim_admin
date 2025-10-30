"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
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
import { MdOutlineVerified } from "react-icons/md";
import { number } from "yup";

interface Plan {
  id: string;
  title: string;
  name: string;
  country: {
    name: string;
  };
  price: string;
  currency: string;
  data: string;
  isUnlimited: boolean;
  validityDays: number;
  isDeleted: boolean;
  isActive: boolean;
  isFeatured?: boolean;
  call?: string;
  sms?: string;
  createdAt: string;
  planId: string;
}

interface PlanTableProps {
  plans: Plan[];
  onToggle: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
  addFeature: (plan: Plan) => void;
}

const columnHelper = createColumnHelper<Plan>();

// ------------------ Action Cell ------------------
const ActionCell: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  onDelete: (plan: Plan) => void;
  addFeature: (plan: Plan) => void;
}> = ({ row, onDelete, addFeature }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isFeatured } = row.original;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex cursor-pointer items-center gap-2 relative">
      {/* Delete Button */}

      {/* 3-dot More Menu */}
      <div className="relative cursor-pointer " ref={dropdownRef}>
        <button
          onClick={() => setMenuOpen((val) => !val)}
          className="p-1 cursor-pointer text-gray-400 hover:text-white transition-colors"
          title="More actions"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute cursor-pointer right-0 z-20 mt-1 min-w-[180px] bg-gray-900 border border-gray-700 rounded shadow-xl py-1">
            <button
              onClick={() => {
                addFeature(row.original);
                setMenuOpen(false);
              }}
              className={`block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-200 ${!isFeatured ? "bg-blue-900" : "bg-red-700"
                } hover:bg-[#16325d] transition-colors`}
            >
              {isFeatured ? "Remove from feature" : "Add to feature"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ------------------ Status Cell ------------------
const StatusCell: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  onToggle: (plan: Plan) => void;
}> = ({ row, onToggle }) => {
  const isActive = row.original.isActive;

  return (
    <div className="flex items-center gap-2">
      <label className="relative inline-flex items-center group cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isActive}
          onChange={() => onToggle(row.original)}
        />
        <span
          className={`
            w-11 h-6 rounded-full transition-all duration-300 ring-1 ring-[#37c74f]/60
            flex items-center
            ${isActive
              ? "bg-gradient-to-r from-[#37c74f] to-[#16325d]"
              : "bg-gradient-to-l from-gray-500 via-gray-700 to-gray-900"
            }
          `}
        >
          <span
            className={`
              w-5 h-5 bg-white shadow-lg rounded-full transform transition-all duration-300
              ${isActive ? "translate-x-5" : ""}
            `}
          ></span>
        </span>
      </label>
      <span
        className={`ml-2 text-xs font-semibold transition-colors duration-300
          ${isActive ? "text-[#37c74f]" : "text-white"}`}
      >
        {isActive ? "Active" : "In Active"}
      </span>
    </div>
  );
};

// ------------------ Main Table ------------------
const PlanTable: React.FC<PlanTableProps> = ({
  plans,
  onDelete,
  onToggle,
  addFeature,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // console.log("----- plans ----", plans);

  const columns = useMemo(
    () => [
      columnHelper.accessor("country.name", {
        header: "Country",
        cell: (info) => (
          <div className="font-medium text-white flex items-center gap-1">
            {info.getValue()}
            {info.row.original.isFeatured && (
              <MdOutlineVerified className="w-6 h-6 text-[#ebbc22] ml-2 " />
            )}
          </div>
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
            <span className="px-2 py-1 bg-[#16325d] text-white rounded text-sm">
              {info.getValue()}
            </span>
          ) : (
            <span className="text-gray-400">N/A</span>
          ),
      }),
      columnHelper.accessor("sms", {
        header: "SMS",
        cell: (info) =>
          info.getValue() && info.getValue() !== "0.00" ? (
            <span className="px-2 py-1 bg-[#16325d] text-white rounded text-sm">
              {info.getValue()}
            </span>
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
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusCell row={row} onToggle={onToggle} />,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionCell row={row} onDelete={onDelete} addFeature={addFeature} />
        ),
      }),
    ],
    [onToggle, onDelete, addFeature]
  );

  const table = useReactTable({
    data: plans,
    columns,
    state: { globalFilter, sorting },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900 mt-8">
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
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {{
                        asc: (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ),
                        desc: (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
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
              <tr
                key={row.id}
                title={`Plan ID: ${row.original?.planId}`} // <-- Tooltip on hover
                className="hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${cell.column.id === "actions" ? "cursor-pointer hover:bg-gray-800/70" : ""
                      }`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
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
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="px-3 py-1 text-sm text-gray-400">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTable;
