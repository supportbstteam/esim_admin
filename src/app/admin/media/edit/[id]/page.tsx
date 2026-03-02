"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchImageById } from "@/store/slice/mediaSlice";
import MediaForm from "@/components/forms/MediaForm";

export default function EditMediaPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { image, loading } = useAppSelector((state) => state.media);

  useEffect(() => {
    if (id) {
      dispatch(fetchImageById(Number(id)));
    }
  }, [id, dispatch]);

  if (loading) return <div className="p-6">Loading image...</div>;

  return <MediaForm initialData={image} isEdit />;
}