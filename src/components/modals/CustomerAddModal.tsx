import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from '@/store';
import { createAdminUser } from '@/store/slice/adminUserSlice';
import toast from 'react-hot-toast';

// Modal Props
type CustomerAddModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const CustomerSchema = Yup.object().shape({
    firstName: Yup.string().trim().min(2).required("First name required"),
    lastName: Yup.string().trim().min(2).required("Last name required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().min(6).required("Password required"),
});

const CustomerAddModal: React.FC<CustomerAddModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
        // console.log("---- values in the craeting user modal ----", values);
        try {
            const response = await dispatch(createAdminUser(values));

            if (response?.type === 'adminUser/create/fulfilled') {
                toast.success(`Created new user successful`)
                setSubmitting();
                resetForm();
                onClose();
            }

            if (response?.type === "adminUser/create/rejected") {
                toast.error(`Creating new user unsuccessful, ${response?.payload?.data?.message}`)
            }

        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (err: any) {
            console.error("Error in the creating user modal", err);;

        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Add Customer</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700 transition text-2xl"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                {/* Formik Form */}
                <Formik
                    initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
                    validationSchema={CustomerSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            {/* First Name */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-800">
                                    First Name
                                </label>
                                <Field
                                    type="text"
                                    name="firstName"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                                <ErrorMessage name="firstName" component="div" className="text-red-600 text-xs mt-1" />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-800">
                                    Last Name
                                </label>
                                <Field
                                    type="text"
                                    name="lastName"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                                <ErrorMessage name="lastName" component="div" className="text-red-600 text-xs mt-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-800">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-xs mt-1" />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-800">
                                    Password
                                </label>
                                <div className="relative">
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800 transition"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                <ErrorMessage name="password" component="div" className="text-red-600 text-xs mt-1" />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Add Customer
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CustomerAddModal;
