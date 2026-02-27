"use client";

import React, { useEffect, useMemo, useState } from "react";
import ESimModal from "@/components/modals/ESimModal";
import { useDispatch, useSelector } from "react-redux";
import { createESim, deleteESim, fetchESims } from "@/store/slice/eSimSlice";
import { fetchCountries } from "@/store/slice/countrySlice";
import toast from "react-hot-toast";
import Loader from "@/components/loader";
import { useAppDispatch, useAppSelector } from "@/store";
import ESimTable from "@/components/tables/ESimTable";
import PageHeader from "@/components/common/PageHeader";
import CommonTableSkeleton from "@/components/skeletons/CommonTableSkeleton";

export default function ESim() {
  const [modalOpen, setModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { eSims, loading, error } = useSelector((state: any) => state.esim);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useAppDispatch();

  const fetchSims = async () => {
    await dispatch(fetchESims());
    await dispatch(fetchCountries());
  };

  useEffect(() => {
    fetchSims();
  }, [user?.id]);

  const handleAddESim = async ({ eSims }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await dispatch(createESim(eSims));

    if (response?.type === "eSim/createESim/fulfilled") {
      fetchSims();
      setModalOpen(false);
      toast.success("E-SIM Added Successfully");
    } else {
      toast.error(response?.payload || "Failed to add E-SIM");
    }
  };

  const handleDeleteESim = async () => {

  };

  const filteredSims = useMemo(() => {
    const search = globalFilter.toLowerCase();
    return eSims?.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sim: any) =>
        sim.productName?.toLowerCase().includes(search) ||
        sim.user?.email?.toLowerCase().includes(search) ||
        sim.user?.firstName?.toLowerCase().includes(search) ||
        sim.user?.lastName?.toLowerCase().includes(search)
    );
  }, [eSims, globalFilter]);

  const pageCount = Math.ceil((filteredSims?.length || 0) / pageSize);
  const paginatedSims = filteredSims?.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const handlePrev = () => pageIndex > 0 && setPageIndex(pageIndex - 1);
  const handleNext = () =>
    pageIndex < pageCount - 1 && setPageIndex(pageIndex + 1);

  // if (loading) return <Loader />;

  return (
    <div className="p-6">
      <PageHeader
        showAddButton={false}
        showBackButton={false}
        title="E-Sims"
        addButtonText="+ Add Testimonial"
        addButtonRoute="/admin/testimonials/manage?mode=create"
      />

      <ESimModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        handleSubmit={handleAddESim}
      />

      {/* {error && <p className="text-red-500">{error}</p>} */}

      {/* Search */}
      <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200 bg-white mt-6">
        {/* <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPageIndex(0);
            }}
            placeholder="Search eSIMs..."
            className="w-full pl-4 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37c74f]"
          />
        </div> */}

        {/* Table */}
        {
          loading ? (
            <CommonTableSkeleton
            columns={7}
            rows={10}
            />
          ) : (
            <ESimTable
              esims={eSims}
              onDeleteESim={handleDeleteESim}
            />
          )
        }
      </div>
    </div>
  );
}
