// components/skeletons/TestimonialFormSkeleton.tsx
import React from "react";

export default function TestimonialFormSkeleton() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow animate-pulse">
      {/* Header */}
      <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>

      {/* Name */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Profession */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
        <div className="h-24 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-3 mt-6">
        <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>

      {/* Button */}
      <div className="h-10 bg-gray-200 rounded w-32 mt-6"></div>
    </div>
  );
}