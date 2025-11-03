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
import { ddmmyyyy } from "@/utils/dateTime";
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
const columnHelper = createColumnHelper<any>();

const CmsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { contents, loading }: any = useAppSelector((state) => state?.contents);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 🗑️ Delete handler
  const handleDelete = async () => {
    try {
      if (!selected?.id) return;
      // await dispatch(deleteContent(selected.id)).unwrap();
      toast.success("Content deleted successfully!");
      setShowModal(false);
    } catch {
      toast.error("Failed to delete content");
    }
  };

  // ✅ Use your already-available data
  const contentArray = useMemo(() => {
    if (!contents) return [];
    return Object.values(contents); // each entry has html, page, title, etc.
  }, [contents]);

  // 🧱 Table Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor("page", {
        header: "Page",
        cell: (info) => (
          <span className="capitalize font-medium text-white">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => (
          <span className="text-gray-200">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("html", {
        header: "Preview",
        cell: (info) => {
          const text = info
            .getValue()
            ?.replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 80);
          return (
            <span className="text-gray-400 text-sm">
              {text || "—"}...
            </span>
          );
        },
      }),
    //   columnHelper.accessor("createdAt", {
    //     header: "Created At",
    //     cell: (info) => (
    //       <span className="text-gray-400">
    //         {ddmmyyyy(info.getValue())}
    //       </span>
    //     ),
    //   }),
    //   columnHelper.accessor("updatedAt", {
    //     header: "Updated At",
    //     cell: (info) => (
    //       <span className="text-gray-400">
    //         {ddmmyyyy(info.getValue())}
    //       </span>
    //     ),
    //   }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return(
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/cms/${row.original.page}`)}
              className="p-2 rounded cursor-pointer hover:bg-gray-700 transition"
            >
              <FiEdit className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
            {/* <button
              onClick={() => {
                setSelected(row.original);
                setShowModal(true);
              }}
              className="p-2 rounded hover:bg-red-700 transition"
            >
              <FiTrash2 className="h-5 w-5 text-red-400 hover:text-white" />
            </button> */}
          </div>
        )},
      }),
    ],
    [router]
  );

  // ⚙️ Table setup
  const table = useReactTable({
    data: contentArray,
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
      <div className="text-center text-gray-400 py-6">
        Loading content...
      </div>
    );

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
            placeholder="Search CMS pages..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f]"
          />
        </div>
      </div>

      {/* 🧱 Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-black/20"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800/50 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-300"
                    >
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
                  No CMS content found.
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
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          –
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
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
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
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

      <ConfirmDeleteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        operatorName={selected?.title}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CmsTable;
