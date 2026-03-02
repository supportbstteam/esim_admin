"use client";

import PageHeader from "@/components/common/PageHeader";
import MediaTable from "@/components/tables/MediaTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchImages } from "@/store/slice/mediaSlice";
import { useEffect } from "react";

export default function AdminImagesPage() {
  const dispatch = useAppDispatch();
  // const { images, loading, pagination } = useAppSelector(state => state?.media)

  useEffect(() => {
    dispatch(fetchImages({ page: 1, limit: 10 }));
  }, [dispatch]);

  // if (loading) return <p>Loading...</p>;

  return (
    <div>
      <PageHeader
        showAddButton={true}
        showBackButton={false}
        title="Media"
        addButtonText="+ Add Media"
        addButtonRoute="/admin/media/add"
      />
      <MediaTable />
    </div>
  );
}