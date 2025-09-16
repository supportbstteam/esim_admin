import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Schema = Yup.object({
    simNumber: Yup.string().required("SIM Number is required"),
    countryName: Yup.string().required("Country Name is required"),
    countryCode: Yup.string().required("Country Code is required"),
    company: Yup.string().required("Company is required"),
    isActive: Yup.boolean(),
});

export default function ESimModal({ open, onClose, handleSubmit }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-md transition-colors">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl p-10 relative flex flex-col gap-6">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-wide">
                        Add eSIM
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-3xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                <Formik
                    initialValues={{
                        simNumber: "",
                        countryName: "",
                        countryCode: "",
                        company: "",
                        isActive: false,
                    }}
                    validationSchema={Schema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="grid grid-cols-2 gap-x-8 gap-y-4 items-start">
                            <div>
                                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">SIM Number</label>
                                <Field
                                    name="simNumber"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="simNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">Country Name</label>
                                <Field
                                    name="countryName"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="countryName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">Country Code</label>
                                <Field
                                    name="countryCode"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="countryCode" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">Company</label>
                                <Field
                                    name="company"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="company" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                                <Field
                                    type="checkbox"
                                    name="isActive"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded transition"
                                />
                                <label className="text-gray-700 dark:text-gray-200">Active</label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 col-span-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 hover:dark:bg-gray-600 transition"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                                    disabled={isSubmitting}
                                >
                                    Save
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
