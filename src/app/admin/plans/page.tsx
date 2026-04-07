"use client";
import React, { useEffect, useRef, useState } from "react";
import { ModalPlanForm } from "@/components/modals/ModalPlanForm";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchThirdPartyPlans } from "@/store/slice/ThirdPartyPlanAPi";
import { fetchCountries } from "@/store/slice/countrySlice";
import { addFeaturePlan, createPlansDb, deletePlanDb, fetchPlansDb, togglePlanStatusDb, updatePlanDb } from "@/store/slice/apiPlanDbSlice";
import toast from "react-hot-toast";
import PlanTable from "@/components/tables/PlanTable";
import { FileDown, FileUp, Loader2 } from "lucide-react";
import SubHeader from "@/components/common/SubHeader";
import CommonTableSkeleton from "@/components/skeletons/CommonTableSkeleton";
import { api } from "@/lib/api";

function Plans() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAppSelector((state) => state.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { plans, loading } = useAppSelector((state: any) => state.plan);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);


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
      console.log("---- plans ----", plans);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(createPlansDb());
      console.log("Add Plan Response:", response); // Log the response to the console
      // if (response?.type === "plansDb/createPlans/fulfilled") {
      //   toast.success("Plans added successfully ");
      // }
      const data = response?.payload;

      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message || "Failed to import plans");
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
  const handleUpdatePrice = async (planId: number, newPrice: string) => {
    try {
      // console.log("---- planId in the handleUpdatePrice ----", planId);
      // console.log("---- newPrice in the handleUpdatePrice ----", newPrice);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(updatePlanDb({ planId, data: { price: newPrice } }));

      if (response?.type === "plansDb/updatePlan/fulfilled") {
        toast.success("Price updated successfully");
        await dispatch(fetchPlansDb());
      } else {
        toast.error(response?.payload?.message || "Failed to update price");
      }
    } catch (err: any) {
      console.error("Error updating price:", err);
      toast.error("An error occurred while updating price");
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

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const response: any = await api({
        url: "/admin/plans/export",
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `plans_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Excel exported successfully");
    } catch (error: any) {
      console.error("Export failed:", error);
      toast.error("Failed to export Excel");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response: any = await api({
        url: "/admin/plans/import-excel",
        method: "POST",
        data: formData,
      });

      toast.success(response.message || "Plans imported successfully");
      await dispatch(fetchPlansDb());
    } catch (error: any) {
      console.error("Import failed:", error);
      toast.error(error?.response?.data?.message || "Failed to import Excel");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportExcel}
        accept=".xlsx, .xls"
        className="hidden"
      />
      <SubHeader
        title="Plans"
        disable={loading || isExporting || isImporting}
        onClick={() => {
          if (loading || isExporting || isImporting)
            return;

          handleAddPlan()
        }}
        showBackButton={false}
        showAddButton={true}
        addButtonText={
          loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : "Import Plans"

        }
        extraButtons={
          <>
            <button
              disabled={loading || isExporting || isImporting}
              className={`flex items-center gap-2 rounded px-5 py-2 text-white bg-[#107c41] hover:bg-[#0d6334] focus:outline-none transition ${loading || isExporting || isImporting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              onClick={handleExportExcel}
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown size={18} />}
              Export Excel
            </button>
            <button
              disabled={loading || isExporting || isImporting}
              className={`flex items-center gap-2 rounded px-5 py-2 text-white bg-[#185abd] hover:bg-[#134896] focus:outline-none transition ${loading || isExporting || isImporting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp size={18} />}
              Import Excel
            </button>
          </>
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
            onUpdatePrice={handleUpdatePrice}
          />
        )
      }
    </div>
  );
}

export default Plans;
