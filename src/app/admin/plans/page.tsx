"use client";
import React, { useEffect, useState } from "react";
import { ModalPlanForm } from "@/components/modals/ModalPlanForm";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchThirdPartyPlans } from "@/store/slice/ThirdPartyPlanAPi";
import { fetchCountries } from "@/store/slice/countrySlice";
import { createPlansDb, deletePlanDb, fetchPlansDb } from "@/store/slice/apiPlanDbSlice";
import toast from "react-hot-toast";
import PlanTable from "@/components/tables/PlanTable";

function Plans() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { plans } = useAppSelector((state: any) => state.plan);

  useEffect(() => {
    const fetchPlans = async () => {
      await dispatch(fetchThirdPartyPlans());
      await dispatch(fetchPlansDb());
      await dispatch(fetchCountries());
    };

    fetchPlans();
  }, [user?.id]);

  // Step 1: Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddPlan = async (values: any) => {
    try {
      if (!values || !Array.isArray(values)) {
        toast.error("Invalid form data");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedPlans: any = values
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((entry: any) => entry.planData)
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
      if (mappedPlans.length === 0) {
        toast.error("No valid plans selected");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(createPlansDb(mappedPlans));
      if (response?.type === "plansDb/createPlans/fulfilled") {
        toast.success("Plans added successfully ✅");
        setIsModalOpen(false);
      } else {
        toast.error("❌ Failed to add plans");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong while adding plans");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditPlan = (plan: any) => {
    toast.success(`Edit plan: ${plan.name}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeletePlan = async (plan: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await dispatch(deletePlanDb(plan?.id));

    if (response?.type === 'plansDb/deletePlan/fulfilled') {
      // console.log("---- delete in the response ----", response);
      toast.success(`Plan Deleted`);
    }

  };

  return (
    <div>
      <div className="flex justify-between w-full items-center">
        <h1 className="text-xl font-semibold mb-4 text-black">Plans</h1>
        <button
          className="bg-[#16325d] text-white rounded px-4 py-2 mb-4"
          onClick={() => setIsModalOpen(true)}
        >
          Add Plan
        </button>
      </div>

      <ModalPlanForm
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPlan}
      />

      {/* Add PlanTable here */}
      <PlanTable
        plans={plans}
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
      />
    </div>
  );
}

export default Plans;
