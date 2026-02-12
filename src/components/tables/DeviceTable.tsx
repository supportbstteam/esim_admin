"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";

import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store";

import {
  deleteDevice,
  fetchDevices,
  toggleDevice,
} from "@/store/slice/devices/deviceThunks";

import { Device } from "@/lib/types";
import { Toggle } from "../ui/Toggle";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

const columnHelper = createColumnHelper<Device>();

export default function DeviceTable() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { list, page, pages, total, limit } =
    useAppSelector((s) => s.devices);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<Device | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    dispatch(
      fetchDevices({
        page: currentPage,
        limit,
        search: globalFilter || undefined,
      })
    );
  }, [dispatch, currentPage, globalFilter]);

  // ================= DELETE =================
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await dispatch(deleteDevice(deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  };

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (r) => r.brand?.name,
        {
          id: "brand",
          header: "Brand",
          cell: info => (
            <div className="text-white font-medium">
              {info.getValue() ?? "—"}
            </div>
          ),
        }
      ),

      columnHelper.accessor("name", {
        header: "Device",
        cell: info => (
          <div className="text-gray-100 font-semibold">
            {info.getValue()}
          </div>
        ),
      }),

      columnHelper.accessor("model", {
        header: "Model",
        cell: info => (
          <div className="text-gray-300 font-mono">
            {info.getValue()}
          </div>
        ),
      }),

      columnHelper.accessor("os", {
        header: "OS",
        cell: info => (
          <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-200">
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("isActive", {
        header: "Active",
        cell: info => (
          <Toggle
            checked={info.getValue()}
            onChange={(val) =>
              dispatch(
                toggleDevice({
                  id: info.row.original.id,
                  isActive: val,
                })
              )
            }
          />
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() =>
                router.push(`/admin/compatible/devices/edit/${row.original.id}`)
              }
              className="p-2 cursor-pointer rounded hover:bg-gray-700 transition"
            >
              <FiEdit className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>

            <button
              onClick={() => setDeleteTarget(row.original)}
              className="p-2 cursor-pointer rounded hover:bg-red-700 transition"
            >
              <FiTrash2 className="h-5 w-5 text-red-400 hover:text-white" />
            </button>
          </div>
        ),
      }),
    ],
    [dispatch]
  );

  const table = useReactTable({
    data: list,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ================= RENDER =================
  return (
    <>
      <ConfirmDeleteModal
        open={!!deleteTarget}
        loading={deleting}
        operatorName={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      {/* ⭐ ALIGNMENT FIX CONTAINER */}
      <div className="max-w-7xl mx-auto px-6">

        <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">

          {/* SEARCH */}
          <div className="p-4 border-b border-gray-700">
            <input
              value={globalFilter}
              onChange={(e) => {
                setCurrentPage(1);
                setGlobalFilter(e.target.value);
              }}
              placeholder="Search devices..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#37c74f]"
            />
          </div>

          {/* TABLE */}
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

          {/* PAGINATION */}
          <div className="px-6 py-3 border-t border-gray-700 flex justify-between text-gray-400">
            <button
              className="hover:text-white cursor-pointer disabled:opacity-40"
              disabled={page === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} of {pages} • Total {total}
            </span>

            <button
              className="hover:text-white cursor-pointer disabled:opacity-40"
              disabled={page === pages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </>
  );

}
