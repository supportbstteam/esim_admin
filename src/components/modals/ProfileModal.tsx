"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { checkAuth } from "@/store/slice/userSlice";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state?.user);

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        name: Yup.string().required("Name is required"),
        notificationMail: Yup.string()
            .email("Invalid email address")
            .nullable()
            .notRequired(),
    });

    const formik = useFormik({
        initialValues: {
            email: user?.username || "",
            name: user?.name || "",
            notificationMail: user?.notificationMail || "",
        },
        enableReinitialize: true, // ✅ important for prefilled values
        validationSchema,
        onSubmit: async (values) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response: any = await api({
                    url: "/admin/update",
                    method: "PUT",
                    data: values,
                });

                if (response?.message === "Profile updated successfully") {
                    toast.success("Profile updated successfully!");
                    await dispatch(checkAuth()); // refresh user data
                    onClose();
                }
            } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to update profile");
            }
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Profile Information
                </h2>

                <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-4 py-2 rounded border ${formik.touched.name && formik.errors.name
                                ? "border-red-500"
                                : "border-gray-300"
                                } text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-4 py-2 rounded border ${formik.touched.email && formik.errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                                } text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        )}
                    </div>

                    {/* Notification Mail */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notification Mail
                        </label>
                        <input
                            type="email"
                            name="notificationMail"
                            placeholder="Enter notification mail (optional)"
                            value={formik.values.notificationMail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-4 py-2 rounded border ${formik.touched.notificationMail && formik.errors.notificationMail
                                ? "border-red-500"
                                : "border-gray-300"
                                } text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {formik.touched.notificationMail && formik.errors.notificationMail && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.notificationMail}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                        >
                            Update Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
