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
import SubHeader from "@/components/common/SubHeader";
import CommonTableSkeleton from "@/components/skeletons/CommonTableSkeleton";

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
  const handleAddPlan = async () => {
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

      // console.log("---- response in the toggle handle ----", response);

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

      // console.log("---- response in the toggle handle ----", response);

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
      <SubHeader
        title="Plans"
        disable={loading}
        onClick={() => {
          handleAddPlan()
        }}
        showBackButton={false}
        addButtonText={
          loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : "Import Plans"
        }
      />

      {/* Add PlanTable here */}
      {
        loading ? (
          <CommonTableSkeleton columns={10} rows={10} showSearch={true} />
        ) : (
          <PlanTable
            plans={plans}
            onToggle={handleToggleStatus}
            onDelete={handleDeletePlan}
            addFeature={handleFeaturePlan}
          />
        )
      }
    </div>
  );
}

export default Plans;
