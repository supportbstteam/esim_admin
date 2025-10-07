"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAllContent } from "@/store/slice/contentSlice";
import { useRouter } from "next/navigation";
import { Plus, FileText } from "lucide-react";

export default function ContentList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { contents, loading, error } = useAppSelector((state) => state.contents);

  useEffect(() => {
    dispatch(fetchAllContent());
  }, [dispatch]);

  const handleNavigate = (page: string) => {
    router.push(`/admin/cms/${page}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-[#16325d]">
        <FileText className="w-6 h-6 animate-spin mr-2" />
        <p className="text-lg font-medium">Loading CMS pages...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-red-600">
        <h2 className="text-lg font-semibold mb-2">Error loading content</h2>
        <p>{error}</p>
      </div>
    );
  }

  const contentArray = Object.values(contents); // Convert contents object to array

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#16325d] tracking-wide">
        All CMS Pages
      </h1>

      {!contentArray.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <FileText className="w-10 h-10 mb-3 opacity-60" />
          <p className="text-lg font-medium">No CMS pages found.</p>
          <button
            onClick={() => handleNavigate("other")}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border border-[#16325d] rounded-lg text-[#16325d] hover:bg-[#16325d] hover:text-white transition-all"
          >
            <Plus size={18} /> Add New Page
          </button>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          contentArray.map((content: any) => (
            <li
              key={content.page}
              onClick={() => handleNavigate(content.page)}
              className="border border-gray-300 rounded-xl p-4 bg-white cursor-pointer hover:shadow-md hover:border-[#16325d] transition-all group"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-[#16325d] text-lg leading-snug group-hover:underline">
                  {content.title || "Untitled Page"}
                </h2>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Page:</span> {content.page}
              </p>

              <div
                className="text-sm text-gray-700 mt-3 line-clamp-3 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: (content.html || "").slice(0, 200) + "...",
                }}
              />
            </li>
          ))}

          {/* ➕ Add New CMS Page */}
          <li
            onClick={() => handleNavigate("other")}
            className="border border-dashed border-gray-400 rounded-xl p-4 cursor-pointer hover:bg-gray-50 hover:border-[#16325d] transition-all text-center"
          >
            <h2 className="font-semibold text-[#16325d] flex items-center justify-center gap-2 text-lg">
              <Plus size={18} /> Add / Edit Other CMS Page
            </h2>
          </li>
        </ul>
      )}
    </div>
  );
}
