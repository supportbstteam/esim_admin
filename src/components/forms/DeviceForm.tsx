"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { createDevice, updateDevice } from "@/store/slice/devices/deviceThunks";
import { fetchBrands } from "@/store/slice/brands/brandThunks";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Toggle } from "../ui/Toggle";
import SubHeader from "../common/SubHeader";

interface Props {
    mode: "create" | "edit";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    device?: any;
}

export default function DeviceForm({ mode, device }: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { list: brands } = useAppSelector((s) => s.brands);

    // ================= FETCH BRANDS =================
    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    // ================= FORM =================
    const formik = useFormik({
        initialValues: {
            name: device?.name || "",
            model: device?.model || "",
            os: device?.os || "ANDROID",
            brandId: device?.brand?.id || "",
            supportsEsim: device?.supportsEsim ?? true,
            isActive: device?.isActive ?? true,
            notes: device?.notes || "",
        },

        enableReinitialize: true,

        validationSchema: Yup.object({
            name: Yup.string().required("Device name required"),
            model: Yup.string().required("Model required"),
            brandId: Yup.number().required("Select a brand"),
        }),

        onSubmit: async (values) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let response: any
            if (mode === "create") {
                response = await dispatch(createDevice(values));
            } else {
                response = await dispatch(
                    updateDevice({
                        id: device.id,
                        data: values,
                    })
                );
            }

            // console.log('-=-=- resposne in teh add data =-=-=-', response);

            if (response?.type === 'devices/create/fulfilled')
                router.push("/admin/compatible/devices");

            if (response?.type === 'devices/update/fulfilled')
                router.push("/admin/compatible/devices");

        },
    });

    // ================= UI =================
    return (
        <div className="bg-white min-h-screen py-10 px-6">
            <SubHeader showBackButton={true} showAddButton={false} title={mode === "create" ? "Add Device" : "Edit Device"} />
            <form
                onSubmit={formik.handleSubmit}
                className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-10 space-y-8"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {mode === "create" ? "Add Device" : "Edit Device"}
                    </h2>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-black cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* NAME */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Device Name
                        </label>

                        <input
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-[#37c74f] outline-none"
                        />

                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.name as string}
                        </p>
                    </div>

                    {/* MODEL */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Model Code
                        </label>

                        <input
                            name="model"
                            onChange={formik.handleChange}
                            value={formik.values.model}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-[#37c74f] outline-none"
                        />

                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.model as string}
                        </p>
                    </div>

                    {/* BRAND */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Brand
                        </label>

                        <select
                            name="brandId"
                            onChange={formik.handleChange}
                            value={formik.values.brandId}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 cursor-pointer focus:ring-2 focus:ring-[#37c74f] outline-none"
                        >
                            <option value="">Select Brand</option>

                            {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                brands.map((b: any) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                        </select>

                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.brandId as string}
                        </p>
                    </div>

                    {/* OS */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Operating System
                        </label>

                        <select
                            name="os"
                            onChange={formik.handleChange}
                            value={formik.values.os}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 cursor-pointer focus:ring-2 focus:ring-[#37c74f] outline-none"
                        >
                            <option value="ANDROID">ANDROID</option>
                            <option value="IOS">IOS</option>
                            <option value="WINDOWS">WINDOWS</option>
                            <option value="OTHER">OTHER</option>
                        </select>
                    </div>

                </div>

                {/* NOTES */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Notes
                    </label>

                    <textarea
                        name="notes"
                        onChange={formik.handleChange}
                        value={formik.values.notes}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-[#37c74f] outline-none"
                    />
                </div>

                {/* TOGGLES */}
                <div className="flex gap-12 pt-4 border-t border-gray-200">

                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">
                            Supports eSIM
                        </span>

                        <Toggle
                            checked={formik.values.supportsEsim}
                            onChange={(val) =>
                                formik.setFieldValue("supportsEsim", val)
                            }
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">
                            Active
                        </span>

                        <Toggle
                            checked={formik.values.isActive}
                            onChange={(val) =>
                                formik.setFieldValue("isActive", val)
                            }
                        />
                    </div>

                </div>

                {/* SUBMIT */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="bg-[#37c74f] hover:bg-[#2fb844] transition px-8 py-3 rounded-lg text-white font-semibold cursor-pointer shadow-md"
                    >
                        {mode === "create"
                            ? "Create Device"
                            : "Update Device"}
                    </button>
                </div>
            </form>
        </div>
    );
}
