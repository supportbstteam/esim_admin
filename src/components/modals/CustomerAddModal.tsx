import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from '@/store';
import { createAdminUser, updateAdminUser } from '@/store/slice/adminUserSlice'; // assume updateAdminUser exists
import toast from 'react-hot-toast';

// Modal Props
type CustomerAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

const CustomerAddModal: React.FC<CustomerAddModalProps> = ({
  isOpen,
  onClose,
  customer = null,
}) => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // Validation schema dynamically adjusts: password required only for new customer
  const CustomerSchema = Yup.object().shape({
    firstName: Yup.string().trim().min(2).required("First name required"),
    lastName: Yup.string().trim().min(2).required("Last name required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: customer
      ? Yup.string().min(6)
      : Yup.string().min(6).required("Password required"),
  });

  const initialValues = {
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    password: "", // always empty on edit for security
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      let response;
      if (customer && customer.id) {
        // Update existing customer
        response = await dispatch(updateAdminUser({ id: customer.id, ...values }));
      } else {
        // Create new customer
        response = await dispatch(createAdminUser(values));
      }

      if (response?.type?.endsWith('/fulfilled')) {
        toast.success(customer ? `Updated user successfully` : `Created new user successfully`);
        resetForm();
        onClose();
      } else if (response?.type?.endsWith('/rejected')) {
        toast.error(`Operation failed: ${response?.payload?.data?.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error in customer modal:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {customer ? "Edit Customer" : "Add Customer"}
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700 transition text-2xl"
            onClick={onClose}
            type="button"
          >
            &times;
          </button>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={CustomerSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5" noValidate>
              {/* First Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="firstName">
                  First Name*
                </label>
                <Field
                  id="firstName"
                  type="text"
                  name="firstName"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              {/* Last Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="lastName">
                  Last Name*
                </label>
                <Field
                  id="lastName"
                  type="text"
                  name="lastName"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="email">
                  Email*
                </label>
                <Field
                  id="email"
                  type="email"
                  name="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
                <ErrorMessage name="email" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="password">
                  {customer ? "Password (leave blank to keep current)" : "Password*"}
                </label>
                <div className="relative">
                  <Field
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 pr-10"
                    autoComplete={customer ? "new-password" : "current-password"}
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
                  {customer ? "Update Customer" : "Add Customer"}
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
