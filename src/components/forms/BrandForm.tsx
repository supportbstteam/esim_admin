"use client";

import React from "react";
import { useAppDispatch } from "@/store";
import { createBrand, updateBrand } from "@/store/slice/brands/brandThunks";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubHeader from "../common/SubHeader";

interface Props {
    mode: "create" | "edit";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    brand?: any;
}

export default function BrandForm({ mode, brand }: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formik: any = useFormik({
        initialValues: {
            name: brand?.name || "",
        },

        enableReinitialize: true,

        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, "Too short")
                .required("Brand name required"),
        }),

        onSubmit: async (values) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let res: any;

            if (mode === "create") {
                res = await dispatch(createBrand({ name: values.name }));
            } else {
                res = await dispatch(
                    updateBrand({
                        id: brand.id,
                        name: values.name,
                    })
                );
            }

            if (res?.meta?.requestStatus === "fulfilled") {
                router.push("/admin/compatible/brands");
            }
        },
    });

    return (
        <div className="bg-white min-h-screen py-10 px-6">
            <SubHeader
                showBackButton
                showAddButton={false}
                title={mode === "create" ? "Add Brand" : "Edit Brand"}
            />

            <form
                onSubmit={formik.handleSubmit}
                className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-10 space-y-8"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {mode === "create" ? "Create Brand" : "Update Brand"}
                    </h2>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-black cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>

                {/* Name Field */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Brand Name
                    </label>

                    <input
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-[#37c74f] outline-none"
                        placeholder="Apple / Samsung / Sony..."
                    />

                    {formik.errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.name}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="bg-[#37c74f] hover:bg-[#2fb844] transition px-8 py-3 rounded-lg text-white font-semibold cursor-pointer shadow-md"
                    >
                        {mode === "create"
                            ? "Create Brand"
                            : "Update Brand"}
                    </button>
                </div>
            </form>
        </div>
    );
}
