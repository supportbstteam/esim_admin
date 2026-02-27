"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import BrandTable from "@/components/tables/BrandTable";
import { useAppDispatch, useAppSelector } from "@/store";
import CommonTableSkeleton from "@/components/skeletons/CommonTableSkeleton";
import { fetchBrands } from "@/store/slice/brands/brandThunks";

const BrandPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector((s) => s.brands);


    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    return (
        <div className="p-6 min-h-screen ">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

                <h1 className="text-2xl font-semibold text-black tracking-tight">
                    Brands
                </h1>

                <button
                    onClick={() => router.push("/admin/compatible/brands/add")}
                    className="
            bg-[#37c74f]
            hover:bg-green-600
            active:scale-[0.98]
            transition
            px-5
            py-2
            rounded-lg
            text-white
            font-medium
            shadow-md
            cursor-pointer
          "
                >
                    + Add Brand
                </button>

            </div>

            {/* Table Card Wrapper */}
            {
                loading ? (
                    <CommonTableSkeleton
                        columns={4}
                        rows={10}
                        showSearch={true}
                    />
                ) : (
                    <BrandTable />
                )
            }

        </div>
    );
};

export default BrandPage;
