"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import BlogsTable from "@/components/tables/BlogsTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchBlogs } from "@/store/slice/blogsSlice";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Blogs() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { blogs, loading, error } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  console.log("=== blogs ===", blogs);

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#16325d]">Blogs</h2>
        <button
          className="rounded cursor-pointer  px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none"
          onClick={() => router.push("/admin/blogs/create")}
        >
          + Add Blog
        </button>
      </div>

      <BlogsTable />
    </div>
  );
}
