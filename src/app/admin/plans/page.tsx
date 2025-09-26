"use client";
import React, { useEffect, useState } from "react";
import { ModalPlanForm } from "@/components/modals/ModalPlanForm";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchThirdPartyPlans } from "@/store/slice/ThirdPartyPlanAPi";
import { fetchCountries } from "@/store/slice/countrySlice";
import { createPlansDb } from "@/store/slice/apiPlanDbSlice";
import toast from "react-hot-toast";

function Plans() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { apiPlans } = useAppSelector((state: any) => state.thirdParty);
  useEffect(() => {
    const fetchPlans = async () => {
      await dispatch(fetchThirdPartyPlans());
      await dispatch(fetchCountries());
    }

    fetchPlans();
  }, [user?.id]);

  // console.log("API Plans:", apiPlans?.data);



  // Step 1: Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddPlan = async (values: any) => {
    try {
      console.log("Submitted values:", values);

      if (!values || !Array.isArray(values)) {
        toast.error("Invalid form data");
        return;
      }

      // Map each entry to match Plan interface
      const mappedPlans = values
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((entry: any) => entry.planData) // only valid ones
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((entry: any) => ({
          planId: entry.planData.id,
          country_id: entry.countryId,
          title: entry.planData.title,
          name: entry.planData.name,
          data: entry.planData.data,
          call: entry.planData.call,
          sms: entry.planData.sms,
          isUnlimited: entry.planData.is_unlimited,
          validityDays: entry.planData.validity_days,
          price: entry.planData.price,
          currency: entry.planData.currency,
          country: entry.planData.country,
        }));

      console.log("Mapped Plans:", mappedPlans);
      // return;

      if (mappedPlans.length === 0) {
        toast.error("No valid plans selected");
        return;
      }

      // Dispatch Redux thunk (POST array of plans)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(createPlansDb(mappedPlans));

      console.log("Create Plans Response:", response);

      if (response?.type === "plansDb/createPlans/fulfilled") {
        toast.success("Plans added successfully ✅");
        setIsModalOpen(false);
      } else {
        toast.error("❌ Failed to add plans");
        console.error("Plan creation failed:", response);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Unexpected error in handleAddPlan:", error);
      toast.error(error?.message || "Something went wrong while adding plans");
    }
  };




  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Plans</h1>
      {/* Step 2: Button to open modal */}
      <button
        className="bg-[#16325d] text-white rounded px-4 py-2 mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add Plan
      </button>

      {/* Step 4: ModalPlanForm integration */}
      <ModalPlanForm
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPlan}
      />
    </div>
  );
}

export default Plans;
