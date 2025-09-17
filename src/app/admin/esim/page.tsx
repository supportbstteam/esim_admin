"use client";

import React, { useEffect, useState } from "react";
import ESimModal from "@/components/modals/ESimModal";
import { useESimActions } from "@/hooks/ESimActions";
import { useDispatch, useSelector } from "react-redux";
import { createESim, deleteESim, fetchESims } from "@/store/slice/eSimSlice";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import ESimCard from "@/components/Cards/ESimCard";
import Loader from "@/components/loader";
import { fetchCountries } from "@/store/slice/countrySlice";

export default function ESim() {
  // const dispatch = use
  const [modalOpen, setModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { eSims, loading, error } = useSelector((state: any) => state?.esim)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: any) => state.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: any = useDispatch();

  const fetchSims = async () => {
    await dispatch(fetchESims());
    await dispatch(fetchCountries());
  };
  // console.log("--- user ---", user);

  useEffect(() => {
    fetchSims();
  }, [user?._id]);
  // console.log("---- e-sims ----", eSims);

  const handleAddESim = async ({eSims}) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await dispatch(createESim(eSims));
    // console.log("-- response in the add sim ---", response);

    if (response?.type === "eSim/createESim/fulfilled") {
      fetchSims();
      setModalOpen(false);
      toast.success("Sim Added Successfully");
    }


    if (response?.type === "eSim/createESim/rejected") {
      fetchSims();
      setModalOpen(false);
      toast.error(response?.payload);
    }

  }

  const handleDeleteESim = async (id: string) => {
    try {
      const response = await dispatch(deleteESim(id));

      if (response?.type === "eSim/deleteESim/fulfilled") {
        fetchSims();
        toast.success("Sim Deleted Successfully");
      }

      if (response?.type === "eSim/deleteESim/rejected") {
        fetchSims();
        // setModalOpen(false);
        toast.error(response?.payload);
      }

      console.log("--- response in the deleting the E-sim ---", response);
    }
    catch (err) {
      console.error("error in the deleting the SIM");
    }
  }

  // if (loading)
  //   return <Loader />

  return (
    loading ? <Loader /> :
      <div className="p-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
          onClick={() => setModalOpen(true)}
        >
          Add E-SIM
        </button>

        <ESimModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          handleSubmit={handleAddESim} // pass the add function to modal
        />
        {error && <p className="text-red-500">{error}</p>}

        <ul className="mt-4 space-y-2">
          {eSims && eSims.map((sim) => (
            <ESimCard key={sim?._id} esim={sim} onDelete={handleDeleteESim} />
          ))}
        </ul>
      </div>
  );
}
