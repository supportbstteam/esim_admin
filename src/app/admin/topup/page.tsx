"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCountries } from "@/store/slice/countrySlice";
import toast from "react-hot-toast";
import { ModalTopupForm } from "@/components/modals/ModalTopupPlan";
import { createTopupPlans, fetchTopupPlans } from "@/store/slice/apiTopupDbSlice";
import { fetchThirdPartyTopupPlans } from "@/store/slice/ThirdPartyTopupSlice";

function Topup() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { topups } = useAppSelector((state: any) => state.thirdPartyTopUp);
    useEffect(() => {
        const fetchPlans = async () => {
            await dispatch(fetchThirdPartyTopupPlans());
            await dispatch(fetchCountries());
        }

        fetchPlans();
    }, [user?.id]);

    console.log("API Topup Plans in page.tsx:", topups);

    // Step 1: Modal open state
    const [isModalOpen, setIsModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddPlan = async (values: any) => {
        try {
            if (!values || !Array.isArray(values)) {
                toast.error("Invalid form data");
                return;
            }

            // Map only the fields present in the TopUpPlan entity
            const mappedPlans = values
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((entry: any) => entry.planData) // ensure valid
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((entry: any) => ({
                    id: entry.planData.id, // ✅ external topupId from API
                    country_id: entry.countryId,
                    title: entry.planData.title,
                    name: entry.planData.name,
                    data: entry.planData.data, // becomes dataLimit on backend
                    is_unlimited: entry.planData.is_unlimited,
                    validity_days: entry.planData.validity_days,
                    price: entry.planData.price,
                    currency: entry.planData.currency,
                }));

            if (mappedPlans.length === 0) {
                toast.error("No valid plans selected");
                return;
            }

            // Dispatch the create thunk
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await dispatch(createTopupPlans(mappedPlans));

            console.log("Create Plans Response:", response);

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





    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">Plans</h1>
            {/* Step 2: Button to open modal */}
            <button
                className="bg-[#16325d] text-white rounded px-4 py-2 mb-4"
                onClick={() => setIsModalOpen(true)}
            >
                Add Topup
            </button>

            {/* Step 4: ModalPlanForm integration */}
            <ModalTopupForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPlan}
            />
        </div>
    );
}

export default Topup;
