"use client";

import React from "react";

interface CommonTableSkeletonProps {
  columns?: number;   // number of columns
  rows?: number;      // number of skeleton rows
  showSearch?: boolean;
}

const CommonTableSkeleton: React.FC<CommonTableSkeletonProps> = ({
  columns = 6,
  rows = 10,
  showSearch = true,
}) => {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-900 animate-pulse">
      
      {/* 🔍 Search Skeleton */}
      {showSearch && (
        <div className="p-4 border-b border-gray-700">
          <div className="h-10 w-full bg-gray-700 rounded-lg" />
        </div>
      )}

      {/* 🧾 Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/* Header */}
          <thead className="bg-gradient-to-r from-[#16325d] to-[#37c74f]">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 w-20 bg-white/30 rounded" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 w-full bg-gray-700 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔢 Pagination Skeleton */}
      <div className="px-6 py-3 border-t border-gray-700 flex items-center justify-between">
        <div className="h-4 w-48 bg-gray-700 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-gray-700 rounded" />
          <div className="h-8 w-24 bg-gray-700 rounded" />
          <div className="h-8 w-16 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CommonTableSkeleton;