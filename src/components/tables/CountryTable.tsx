"use client";
import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { Toggle } from '../ui/Toggle';
import { updateCountry } from '@/store/slice/countrySlice';
import { useAppDispatch } from '@/store';
import toast from 'react-hot-toast';

interface Country {
  id: string;
  name: string;
  isoCode: string;
  iso3Code: string;
  currency: string;
  phoneCode: string;
  isActive: boolean;
}

interface CountryTableProps {
  countries: Country[];
  onEdit: (country: Country) => void;
}

const columnHelper = createColumnHelper<Country>();
const CountryTable: React.FC<CountryTableProps> = ({ countries, onEdit }) => {
  const dispatch = useAppDispatch();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Country Name',
        cell: info => <div className="font-medium text-white">{info.getValue()}</div>,
      }),
      columnHelper.accessor('isoCode', {
        header: 'ISO Code',
        cell: info => (
          <div className="px-2 py-1 bg-gray-700 rounded text-center text-white font-mono text-sm">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('iso3Code', {
        header: 'ISO3 Code',
        cell: info => (
          <div className="px-2 py-1 bg-gray-700 rounded text-center text-white font-mono text-sm">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('currency', {
        header: 'Currency',
        cell: info => (
          <div className="px-2 py-1 bg-[#16325d] text-white rounded text-sm font-mono">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('phoneCode', {
        header: 'Phone Code',
        cell: info => <div className="text-[#37c74f] font-medium">{info.getValue()}</div>,
      }),

      // ✅ Toggle for Active Status
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) => {
          const country = info.row.original;

          return (
            <div className="flex items-center justify-center">
              <Toggle
                checked={country.isActive}
                onChange={async (newValue: boolean) => {
                  try {
                    const result = await dispatch(
                      updateCountry({
                        id: country.id,
                        data: { isActive: newValue },
                      })
                    ).unwrap();

                    toast.success("Updated successfully");
                    // console.log("✅ Updated country:", result);
                  } catch (err) {
                    toast.error(
                      typeof err === "string" ? err : "Failed to update country"
                    );
                    console.error("❌ Failed to update country:", err);
                  }
                }}
              />
            </div>
          );
        },
      }),

      // ✅ Actions Column
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => onEdit(row.original)}
            className="p-1 cursor-pointer text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 
                2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        ),
      }),
    ],
    [onEdit, dispatch]
  );

  const table = useReactTable({
    data: countries,
    columns,
    state: { globalFilter, sorting },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900">
      {/* 🔍 Search Bar */}
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 
                0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search countries..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f] focus:border-transparent"
          />
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-black/20 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center cursor-pointer gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-800/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${cell.column.id === 'actions'
                      ? 'cursor-pointer hover:bg-gray-800/70'
                      : ''
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

      {/* 🔢 Pagination */}
      <div className="px-6 py-3 border-t border-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Showing{' '}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryTable;