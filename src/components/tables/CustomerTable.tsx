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
import CustomerAddModal from "@/components/modals/CustomerAddModal";
import { FiEdit, FiTrash2 } from "react-icons/fi";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  createdAt: string;
};

interface Props {
  customers: Customer[];
  onToggleBlock: (id: string, val: boolean) => void;
  onToggleDelete: (id: string, val: boolean) => void;
}

const Toggle = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    className={`relative w-12 h-6 bg-gray-300 rounded-full p-1 transition-colors duration-200 
      ${checked ? "bg-green-500" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={() => !disabled && onChange(!checked)}
    aria-pressed={checked}
    disabled={disabled}
    type="button"
  >
    <span
      className={`absolute top-0 left-0 h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-0"
        }`}
    />
  </button>
);

const columnHelper = createColumnHelper<Customer>();

const CustomerTable: React.FC<Props> = ({
  customers,
  onToggleBlock,
  onToggleDelete,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingCustomer(null);
    setModalOpen(false);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("firstName", {
        header: "First Name",
        cell: info => <div className="text-white font-medium">{info.getValue()}</div>,
      }),
      columnHelper.accessor("lastName", {
        header: "Last Name",
        cell: info => <div className="text-white">{info.getValue()}</div>,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: info => (
          <div className="text-blue-400 font-mono truncate max-w-xs">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("isVerified", {
        header: "Verified",
        cell: info => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${info.getValue() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {info.getValue() ? "Yes" : "No"}
          </span>
        ),
      }),
      columnHelper.accessor("isBlocked", {
        header: "Blocked",
        cell: info => (
          <Toggle
            checked={info.getValue()}
            onChange={val => onToggleBlock(info.row.original.id, val)}
          />
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: info => (
          <span className="text-gray-300">
            {new Date(info.getValue()).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
        sortingFn: "datetime",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {/* Edit Button */}
            <button
              onClick={() => openEditModal(row.original)}
              className="p-2 rounded hover:bg-gray-700 transition"
              aria-label="Edit customer"
              type="button"
            >
              <FiEdit className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onToggleDelete(row.original.id, true)}
              className="p-2 rounded hover:bg-red-700 transition"
              aria-label="Delete customer"
              type="button"
            >
              <FiTrash2 className="h-5 w-5 text-red-400 hover:text-white" />
            </button>
          </div>
        ),
      }),
    ],
    [onToggleBlock, onToggleDelete]
  );


  const table = useReactTable({
    data: customers,
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
      <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">
        {/* Search Input */}
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
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f]"
            />
          </div>
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
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-800/50 transition">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-300">
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
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–{" "}
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

      {/* Modal for add/edit */}
      <CustomerAddModal
        isOpen={modalOpen}
        onClose={closeModal}
        customer={editingCustomer}
      />
    </>
  );
};

export default CustomerTable;
