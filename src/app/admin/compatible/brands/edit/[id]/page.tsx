"use client";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/store";
import BrandForm from "@/components/forms/BrandForm";

export default function Page() {
  const { id } = useParams();

  const brand = useAppSelector((s) =>
    s.brands.list.find((b) => b.id === Number(id))
  );

  // same behavior as device page
  if (!brand) return null;

  return <BrandForm mode="edit" brand={brand} />;
}
