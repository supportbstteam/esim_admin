"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAllContent } from "@/store/slice/contentSlice";
import { useRouter } from "next/navigation";

export default function ContentList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { contents, loading } = useAppSelector((state) => state.contents);

  useEffect(() => {
    dispatch(fetchAllContent());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  const handleNavigate = (page: string) => {
    router.push(`/admin/cms/${page}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#16325d]">All CMS Pages</h1>

      {Object.keys(contents).length === 0 ? (
        <p>No pages found.</p>
      ) : (
        <ul className="space-y-3">
          {Object.entries(contents).map(([key, value]) => (
            <li
              key={key}
              onClick={() => handleNavigate(key)}
              className="border border-[#5c5c5c] rounded p-3 cursor-pointer hover:bg-gray-50 transition"
            >
              <h2 className="font-semibold text-black text-lg capitalize">{key}</h2>
              <div
                className="text-sm text-gray-700 prose max-w-none mt-2"
                dangerouslySetInnerHTML={{
                  __html: value.slice(0, 200) + "...",
                }}
              />
            </li>
          ))}

          {/* “Add Other CMS” option */}
          <li
            onClick={() => handleNavigate("other")}
            className="border border-dashed border-[#5c5c5c] rounded p-3 cursor-pointer hover:bg-gray-100 transition text-center"
          >
            <h2 className="font-semibold text-[#16325d] text-lg">
              + Add / Edit Other CMS Page
            </h2>
          </li>
        </ul>
      )}
    </div>
  );
}
