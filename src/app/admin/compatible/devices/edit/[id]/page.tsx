"use client";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/store";
import DeviceForm from "@/components/forms/DeviceForm";

export default function Page() {
  const { id } = useParams();
  const device = useAppSelector((s) =>
    s.devices.list.find((d) => d.id === Number(id))
  );

  if (!device) return null;

  return <DeviceForm mode="edit" device={device} />;
}
