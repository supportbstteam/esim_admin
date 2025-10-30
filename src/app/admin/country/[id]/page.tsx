"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { createCountry, fetchCountries, updateCountry } from "@/store/slice/countrySlice";
import toast from "react-hot-toast";
import UploadImage from "@/components/ImageUploader";
import { Toggle } from "@/components/ui/Toggle";
import { FaArrowLeft } from "react-icons/fa";

// Country Interface
interface Country {
    id?: string;
    name: string;
    isoCode: string;
    iso3Code: string;
    currency: string;
    phoneCode: string;
    isActive: boolean;
    description: string;
    imageUrl?: string;
}

// ✅ Yup Validation
const validationSchema = Yup.object({
    name: Yup.string().required("Country name is required"),
    isoCode: Yup.string().required("ISO code is required").length(2),
    iso3Code: Yup.string().required("ISO3 code is required").length(3),
    currency: Yup.string().required("Currency is required").length(3),
    phoneCode: Yup.string().required("Phone code is required"),
    isActive: Yup.boolean().required(),
    description: Yup.string().nullable(),
    imageUrl: Yup.string().url("Must be a valid image URL").nullable(),
});

const CountryEditPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { countries } = useAppSelector((state) => state.countries);

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch countries on mount
    useEffect(() => {
        const fetchAdminCountry = async () => {
            try {
                await dispatch(fetchCountries());
            } finally {
                setLoading(false);
            }
        };
        fetchAdminCountry();
    }, [dispatch]);

    // ✅ Get country (or use session fallback)
    let country = countries?.find((c) => c.id === id);
    if (!country && typeof window !== "undefined") {
        const stored = sessionStorage.getItem("editCountryData");
        if (stored) country = JSON.parse(stored);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600">
                Loading country data...
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialValues: any = country || {
        name: "",
        isoCode: "",
        iso3Code: "",
        currency: "",
        phoneCode: "",
        isActive: true,
        description: "",
        imageUrl: "",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: Country, { setSubmitting }: any) => {
        try {
            let response;
            if (country) {
                response = await dispatch(updateCountry({ id: country.id, data: values }));
            } else {
                response = await dispatch(createCountry(values));
            }

            if (response?.type?.includes("/fulfilled")) {
                toast.success(country ? "Country Updated Successfully" : "Country Added Successfully");
                router.push("/admin/country");
            } else {
                toast.error("Failed to save country");
            }
        } catch (error) {
            console.error("Error saving country:", error);
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-2xl mt-8">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="px-2 py-1.5 text-sm font-semibold  text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                   <FaArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">
                    {country ? "Edit Country" : "Add Country"}
                </h1>
            </div>


            {/* Form */}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className="space-y-6">
                        {/* Country Name */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">
                                Country Name <span className="text-red-600">*</span>
                            </label>
                            <Field
                                name="name"
                                type="text"
                                placeholder="United States"
                                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* ISO Codes */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    ISO Code <span className="text-red-600">*</span>
                                </label>
                                <Field
                                    name="isoCode"
                                    type="text"
                                    maxLength={2}
                                    placeholder="US"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <ErrorMessage name="isoCode" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    ISO3 Code <span className="text-red-600">*</span>
                                </label>
                                <Field
                                    name="iso3Code"
                                    type="text"
                                    maxLength={3}
                                    placeholder="USA"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <ErrorMessage name="iso3Code" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Currency & Phone Code */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Currency Code <span className="text-red-600">*</span>
                                </label>
                                <Field
                                    name="currency"
                                    type="text"
                                    maxLength={3}
                                    placeholder="USD"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <ErrorMessage name="currency" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Phone Code <span className="text-red-600">*</span>
                                </label>
                                <Field
                                    name="phoneCode"
                                    type="text"
                                    placeholder="+1"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <ErrorMessage name="phoneCode" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Description</label>
                            <Field
                                as="textarea"
                                name="description"
                                rows={3}
                                placeholder="Write something about this country..."
                                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Image Upload */}
                        <UploadImage
                            label="Country Flag / Image"
                            value={values.imageUrl}
                            onChange={(url) => setFieldValue("imageUrl", url)}
                        />

                        {/* Active Toggle */}
                        <div className="flex items-center gap-2">
                            <Toggle
                                checked={values?.isActive}
                                onChange={(val) => setFieldValue("isActive", val)}
                            />
                            <label className="text-gray-700 select-none">
                                {values?.isActive ? "Active" : "Inactive"}
                            </label>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                                className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || uploading}
                                className="px-6 py-2 font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                            >
                                {isSubmitting && (
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                )}
                                {isSubmitting
                                    ? country
                                        ? "Updating..."
                                        : "Adding..."
                                    : country
                                        ? "Update Country"
                                        : "Add Country"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CountryEditPage;
