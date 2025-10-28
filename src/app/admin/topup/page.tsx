"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCountries } from "@/store/slice/countrySlice";
import toast from "react-hot-toast";
import { ModalTopupForm } from "@/components/modals/ModalTopupPlan";
import { createTopupPlans, deleteTopupPlan, fetchTopupPlans, postInActiveTopupPlan } from "@/store/slice/apiTopupDbSlice";
import { fetchThirdPartyTopupPlans } from "@/store/slice/ThirdPartyTopupSlice";
import TopupTable from "@/components/tables/TopUpTable";
import { Loader2 } from "lucide-react";

function Topup() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.user);
    // Get topups from the correct slice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { items, loading } = useAppSelector((state: any) => state.topup);

    useEffect(() => {
        const fetchPlans = async () => {
            await dispatch(fetchThirdPartyTopupPlans());
            await dispatch(fetchCountries());
            await dispatch(fetchTopupPlans());
        };
        fetchPlans();
    }, [user?.id]);

    // Modal open state
    const [isModalOpen, setIsModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddPlan = async (values: any) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await dispatch(createTopupPlans());
            if (response?.type === "topupPlans/create/fulfilled") {
                toast.success("✅ Plans added successfully");
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleToggleStatus = async (topup: any) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await dispatch(postInActiveTopupPlan({ id: topup?.id, isActive: topup?.isActive }))

            if (response?.type === "topupPlans/toggleStatus/fulfilled") {
                toast.success("Status changed successfully")
                await dispatch(fetchTopupPlans());
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
    const handleDeleteTopup = async (topup: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await dispatch(deleteTopupPlan(topup?.id));

        if (response?.type === 'topupPlans/delete/fulfilled') {
            // console.log("---- delete in the response ----", response);
            toast.success(`Plan Deleted`);
        };
    }

    return (
        <div>
            <div className="flex justify-between items-center w-full">
                <h1 className="text-xl  font-semibold mb-4 text-black ">Top Up</h1>
                <button
                    disabled={loading}
                    className="bg-[#16325d] flex row items-center justify-center cursor-pointer text-white rounded px-4 py-2 mb-4"
                    onClick={handleAddPlan}
                >

                    {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                    {loading ? "Importing..." : "Import Topup Plans"}
                </button>
            </div>
            <ModalTopupForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPlan}
            />

            {/* TopupTable integration */}
            <TopupTable
                topups={items}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTopup}
            />
        </div>
    );
}

export default Topup;
