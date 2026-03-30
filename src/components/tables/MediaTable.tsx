"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
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
import { deleteImage, fetchImages } from "@/store/slice/mediaSlice";
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

  const { images, loading, pagination } = useAppSelector(
    (state) => state.media
  );

  const [searchInput, setSearchInput] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selected, setSelected] = useState<ImageType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setGlobalFilter(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // fetch images
  useEffect(() => {
    dispatch(fetchImages({ page, limit, search: globalFilter }));
  }, [dispatch, page, limit, globalFilter]);

  // delete
  const handleDelete = async () => {
    try {
      if (!selected?.id) return;

      await dispatch(deleteImage(selected.id)).unwrap();

      dispatch(fetchImages({ page, limit, search: globalFilter }));

      toast.success("Image deleted successfully!");
      setShowModal(false);
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // copy
  const handleCopy = async (fullUrl: string) => {
  try {
    console.log("copy:", fullUrl);

    // try modern clipboard
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Image URL copied!");
      return;
    } catch (err) {
      console.warn("clipboard failed, using fallback");
    }

    // fallback
    const textarea = document.createElement("textarea");
    textarea.value = fullUrl;

    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (successful) {
      toast.success("Image URL copied!");
    } else {
      toast.error("Copy failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to copy URL");
  }
};

  const columns = useMemo(
    () => [
      columnHelper.accessor("filePath", {
        header: "Preview",
        cell: (info) => {
          const fullUrl = info.getValue()
            ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${info.getValue()}`
            : "";

          return (
            <img
              src={fullUrl}
              alt="media"
              className="w-14 h-14 object-cover rounded"
            />
          );
        },
      }),

      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <span className="text-white font-medium">
            {info.getValue() ||
              info.row.original.originalName ||
              "No Name"}
          </span>
        ),
      }),

      columnHelper.accessor("createdAt", {
        header: "Created",
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

          const fullUrl = joinUrl(
            `${process.env.NEXT_PUBLIC_API_URL_IMAGE}/`,
            image.filePath
          );

          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(fullUrl)}
                className="p-2 cursor-pointer hover:bg-gray-700 rounded"
              >
                <FiCopy />
              </button>

              <button
                onClick={() =>
                  router.push(`/admin/media/edit/${image.id}`)
                }
                className="p-2 cursor-pointer hover:bg-gray-700 rounded"
              >
                <FiEdit />
              </button>

              <button
                onClick={() => {
                  setSelected(image);
                  setShowModal(true);
                }}
                className="p-2 cursor-pointer hover:bg-red-700 rounded"
              >
                <FiTrash2 />
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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading)
    return <CommonTableSkeleton columns={4} rows={10} showSearch />;

  return (
  <div className="rounded-lg shadow bg-white border border-gray-200">
    
    {/* search header (LIGHT) */}
    <div className="p-4 border-b border-gray-200 flex gap-3 bg-gray-900">
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search media..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={limit}
        onChange={(e) => {
          setPage(1);
          setLimit(Number(e.target.value));
        }}
        className="px-3 py-2 border cursor-pointer border-gray-300 rounded-lg bg-white text-gray-900"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>

    {/* DARK TABLE */}
    <div className="bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-white text-xs uppercase"
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

          <tbody className="divide-y divide-gray-800">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-800">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-gray-200"
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

      {/* pagination (dark) */}
      <div className="px-6 py-3 border-t border-gray-800 flex justify-between items-center">
        <div className="text-gray-400">
          Total: {pagination?.total || 0} images
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="text-gray-400 hover:text-white"
          >
            Prev
          </button>

          <span className="text-gray-400">
            {pagination?.page} / {pagination?.totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(p + 1, pagination?.totalPages || 1)
              )
            }
            disabled={page === pagination?.totalPages}
            className="text-gray-400 hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
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