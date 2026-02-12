"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAllContent } from "@/store/slice/contentSlice";
import { useRouter } from "next/navigation";
import { Plus, FileText } from "lucide-react";
import CmsTable from "@/components/tables/CmsTable";
import PageHeader from "@/components/common/PageHeader";
import { fetchAllPages, fetchPageBySlug } from "@/store/thunks/CmsPageThunk";
import Cms2Table from "@/components/tables/Cms2Table";
import { resetCMSState } from "@/store/slice/cmsPageSlice";

export default function ContentCMS() {
  const dispatch = useAppDispatch();
  const { pages, loading } = useAppSelector((s) => s.cmsPages);

  useEffect(() => {
    dispatch(fetchAllPages());
  }, []);


  // console.log("-=-=-=-=--= pages  -=-=-=-=-=-=",pages);


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
        title="CMS2 Pages"
        showBackButton={false}
        showAddButton={true}
        addButtonText="+ Add CMS2"
        addButtonRoute={`/admin/content/other`}
      />

      <Cms2Table />
    </div>
  );
}
