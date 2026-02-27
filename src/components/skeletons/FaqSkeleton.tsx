"use client";

import React from "react";

function FaqCreateSkeleton() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow animate-pulse">
      {/* Page Header */}
      <div className="h-8 w-40 bg-gray-200 rounded mb-6" />

      {/* Question Field */}
      <div className="mb-4">
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div>

      {/* Answer Field */}
      <div className="mb-4">
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-24 w-full bg-gray-200 rounded" />
      </div>

      {/* Order Field */}
      <div className="mb-4">
        <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div>

      {/* Toggle */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-6 w-12 bg-gray-200 rounded-full" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>

      {/* Button */}
      <div className="mt-5">
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export default FaqCreateSkeleton;