"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAllContent } from "@/store/slice/contentSlice";
import { useRouter } from "next/navigation";
import { Plus, FileText } from "lucide-react";
import CmsTable from "@/components/tables/CmsTable";
import PageHeader from "@/components/common/PageHeader";

export default function ContentList() {
  const dispatch = useAppDispatch();
  const { contents, loading, error } = useAppSelector((state) => state.contents);

  useEffect(() => {
    dispatch(fetchAllContent());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-[#16325d]">
        <FileText className="w-6 h-6 animate-spin mr-2" />
        <p className="text-lg font-medium">Loading CMS pages...</p>
      </div>
    );
  }

  return (
    <div className="px-4 mt-6">
      <PageHeader
        title="CMS Pages"
        showBackButton={false}
        showAddButton={false}
        addButtonText="+ Add CMS"
        addButtonRoute={`/admin/cms/other`}
      />

      <CmsTable />
    </div>
  );
}
