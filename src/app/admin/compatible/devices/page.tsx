"use client";

import DeviceTable from "@/components/tables/DeviceTable";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";

export default function DevicesPage() {
  const router = useRouter();
  const { list, page, pages, total, limit } = useAppSelector((s) => s.devices);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl text-black font-semibold">
          Devices
        </h1>

        <button
          onClick={() => router.push("/admin/compatible/devices/add")}
          className="
            bg-green-600
            text-white
            px-4
            py-2
            rounded-lg
            hover:bg-green-700
            cursor-pointer
            shadow
          "
        >
          + Add Device
        </button>

      </div>

      {/* Table */}
      {
        list && <DeviceTable />
      }


    </div>
  );
}
