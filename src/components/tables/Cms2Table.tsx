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
import { FiEdit } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { ddmmyyyy } from "@/utils/dateTime";
import { fetchPageBySlug } from "@/store/thunks/CmsPageThunk";
import { resetCMSState } from "@/store/slice/cmsPageSlice";

/* eslint-disable @typescript-eslint/no-explicit-any */
const columnHelper = createColumnHelper<any>();

const Cms2Table: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { pages, loading } = useAppSelector(
    (state) => state.cmsPages
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  /* ---------------- PREVIEW TEXT ---------------- */
  const getPreviewText = (sections: any[]) => {
    if (!sections || !sections.length) return "—";

    const first = sections[0];

    if (first?.data?.heading) return first.data.heading;

    if (
      first?.data?.description?.paragraphs &&
      first.data.description.paragraphs.length
    ) {
      return first.data.description.paragraphs[0].content;
    }

    return "—";
  };

  /* ---------------- TABLE DATA ---------------- */
  const tableData = useMemo(() => {
    return pages ?? [];
  }, [pages]);

  /* ---------------- COLUMNS ---------------- */
  const columns = useMemo(
    () => [
      columnHelper.accessor("page", {
        header: "Page",
        cell: (info) => (
          <span className="capitalize font-semibold text-white">
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("sections", {
        header: "Sections",
        cell: (info) => (
          <span className="text-gray-300">
            {info.getValue()?.length ?? 0}
          </span>
        ),
      }),

      columnHelper.display({
        id: "preview",
        header: "Preview",
        cell: ({ row }) => (
          <span className="text-gray-400 text-sm line-clamp-2">
            {getPreviewText(row.original.sections)}
          </span>
        ),
      }),

      columnHelper.accessor("updatedAt", {
        header: "Updated",
        cell: (info) => (
          <span className="text-gray-400">
            {ddmmyyyy(info.getValue())}
          </span>
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() =>{
              dispatch(resetCMSState());
              dispatch(fetchPageBySlug(row.original.page));
              router.push(`/admin/content/${row.original.page}`)
            }}
            className="p-2 rounded hover:bg-gray-700 transition"
          >
            <FiEdit className="h-5 w-5 text-gray-400 hover:text-white" />
          </button>
        ),
      }),
    ],
    [router]
  );

  /* ---------------- TABLE INSTANCE ---------------- */
  const table = useReactTable({
    data: tableData,
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

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-10">
        Loading CMS pages...
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-900">

      {/* 🔍 SEARCH */}
      <div className="p-4 border-b border-gray-700">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search CMS pages..."
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 📋 TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer"
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800 transition">
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
                  className="text-center text-gray-400 py-8"
                >
                  No CMS pages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="px-6 py-3 border-t border-gray-700 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cms2Table;
