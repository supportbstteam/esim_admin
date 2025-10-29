"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React from "react";
import BlogEditor from "@/components/editor/BlogEditor";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: PageProps) {
  return (
    <div className="p-6">
      <BlogEditor blogId={params.id} />
    </div>
  );
}
