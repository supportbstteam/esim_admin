"use client";

import { useCMS } from "@/components/useCMS";

export default function PageInput() {
  const { page, setPage } = useCMS();

  return (
    <div className="px-6 py-4 border-b bg-white">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Page Slug
      </label>
      <input
        value={page}
        onChange={(e) => setPage(e.target.value)}
        placeholder="privacy-policy"
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-black"
      />
      <p className="text-xs text-gray-400 mt-1">
        Example: privacy-policy, terms-and-conditions
      </p>
    </div>
  );
}
