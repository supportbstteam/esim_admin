"use client";
import React, { useEffect, useState } from "react";
import { ModalPlanForm } from "@/components/modals/ModalPlanForm";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchThirdPartyPlans } from "@/store/slice/ThirdPartyPlanAPi";
import { fetchCountries } from "@/store/slice/countrySlice";
import { addFeaturePlan, createPlansDb, deletePlanDb, fetchPlansDb, togglePlanStatusDb } from "@/store/slice/apiPlanDbSlice";
import toast from "react-hot-toast";
import PlanTable from "@/components/tables/PlanTable";
import { Loader2 } from "lucide-react";

function Plans() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { plans, loading } = useAppSelector((state: any) => state.plan);


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
    // setLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(createPlansDb());
      if (response?.type === "plansDb/createPlans/fulfilled") {
        toast.success("Plans added successfully ✅");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong while adding plans");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleToggleStatus = async (plan: any) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(togglePlanStatusDb({ id: plan?.id, isActive: plan?.isActive }))

      if (response?.type === "plansDb/toggleStatus/fulfilled") {
        toast.success("Status changed successfully")
        await dispatch(fetchPlansDb());
      }

      console.log("---- response in the toggle handle ----", response);

      // if(response?.type === "")
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      console.error("Error in the handling status:", err);

    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFeaturePlan = async (plan: any) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(addFeaturePlan({ id: plan?.id, isFeatured: plan?.isFeatured }))

      if (response?.type === "plansDb/addFeaturePlan/fulfilled") {
        toast.success("Status changed successfully")
        await dispatch(fetchPlansDb());
      }

      console.log("---- response in the toggle handle ----", response);

      // if(response?.type === "")
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      console.error("Error in the handling status:", err);

    }
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
          disabled={loading}
          className="bg-[#16325d] flex row justify-center items-center gap-2 cursor-pointer text-white rounded px-4 py-2 mb-4"
          onClick={handleAddPlan}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
          {loading ? "Importing..." : "Import Plans"}
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
        onToggle={handleToggleStatus}
        onDelete={handleDeletePlan}
        addFeature={handleFeaturePlan}
      />
    </div>
  );
}

export default Plans;
