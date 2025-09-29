"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCountries } from "@/store/slice/countrySlice";
import toast from "react-hot-toast";
import { ModalTopupForm } from "@/components/modals/ModalTopupPlan";
import { createTopupPlans, deleteTopupPlan, fetchTopupPlans } from "@/store/slice/apiTopupDbSlice";
import { fetchThirdPartyTopupPlans } from "@/store/slice/ThirdPartyTopupSlice";
import TopupTable from "@/components/tables/TopUpTable";

function Topup() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.user);
    // Get topups from the correct slice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { items } = useAppSelector((state: any) => state.topup);

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
            if (!values || !Array.isArray(values)) {
                toast.error("Invalid form data");
                return;
            }
            const mappedPlans = values
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((entry: any) => entry.planData)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((entry: any) => ({
                    id: entry.planData.id,
                    country_id: entry.countryId,
                    title: entry.planData.title,
                    name: entry.planData.name,
                    data: entry.planData.data,
                    is_unlimited: entry.planData.is_unlimited,
                    validity_days: entry.planData.validity_days,
                    price: entry.planData.price,
                    currency: entry.planData.currency,
                }));
            if (mappedPlans.length === 0) {
                toast.error("No valid plans selected");
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await dispatch(createTopupPlans(mappedPlans));
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

    // Handlers for table actions (implement edit/delete logic here)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEditTopup = (topup: any) => {
        // TODO: Implement edit modal or inline edit
        toast.success(`Edit Topup: ${topup.name}`);
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
            <h1 className="text-xl font-semibold mb-4">Plans</h1>
            <button
                className="bg-[#16325d] text-white rounded px-4 py-2 mb-4"
                onClick={() => setIsModalOpen(true)}
            >
                Add Topup
            </button>
            <ModalTopupForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPlan}
            />

            {/* TopupTable integration */}
            <TopupTable
                topups={items}
                onEdit={handleEditTopup}
                onDelete={handleDeleteTopup}
            />
        </div>
    );
}

export default Topup;
