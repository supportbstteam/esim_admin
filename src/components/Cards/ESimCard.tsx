import React, { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

interface ESimCardProps {
  esim: any;
  onDelete: (id: string) => void;
}

export default function ESimCard({ esim, onDelete }: ESimCardProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(esim._id);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <Link href={`/admin/esim/${esim._id}`} className="block group">
        <div className="flex relative items-center bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 border border-gray-200 px-6 py-5 gap-5 cursor-pointer group-hover:ring-2 group-hover:ring-blue-300">
          <div className="flex flex-col flex-1">
            <div className="flex gap-4 items-center mb-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 tracking-wide">
                {esim.simNumber}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${esim.isActive ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                {esim.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">
              {esim.country?.name} ({esim?.country?.isoCode})
            </div>
            <div className="text-sm text-gray-500 mb-1">
              Company: <span className="font-semibold">{esim.company}</span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mt-2">
              <span>Start: {esim.startDate ? new Date(esim.startDate).toLocaleDateString("en-GB") : <em>N/A</em>}</span>
              <span>End: {esim.endDate ? new Date(esim.endDate).toLocaleDateString("en-GB") : <em>N/A</em>}</span>
              <span>Plans: <span className="font-semibold">{esim.plans?.length ?? 0}</span></span>
            </div>
          </div>

          <button
            type="button"
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 rounded-full bg-red-50 hover:bg-red-100 transition duration-150 z-10"
            onClick={(e) => {
              e.preventDefault(); // prevent navigation
              setDeleteModalOpen(true);
            }}
            aria-label="Delete eSIM"
          >
            <Trash2 size={22} />
          </button>
        </div>
      </Link>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        operatorName={esim.simNumber}
      />
    </>
  );
}
