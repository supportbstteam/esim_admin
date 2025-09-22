"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createCountry } from "@/store/slice/countrySlice";
import toast from "react-hot-toast";

interface Country {
  _id?: string;
  name: string;
  isoCode: string;
  iso3Code: string;
  currency: string;
  phoneCode: string;
  isActive: boolean;
}

interface AddCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  country?: Country; // <-- for edit mode
}

const validationSchema = Yup.object({
  name: Yup.string().required("Country name is required"),
  isoCode: Yup.string().required("ISO code is required").length(2),
  iso3Code: Yup.string().required("ISO3 code is required").length(3),
  currency: Yup.string().required("Currency is required").length(3),
  phoneCode: Yup.string().required("Phone code is required"),
  isActive: Yup.boolean().required(),
});

const AddCountryModal: React.FC<AddCountryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  country,
}) => {
  const dispatch: any = useDispatch();
  if (!isOpen) return null;

  const initialValues: Country = country || {
    name: "",
    isoCode: "",
    iso3Code: "",
    currency: "",
    phoneCode: "",
    isActive: true,
  };

  const handleSubmit = async (values: Country, { setSubmitting, resetForm }: any) => {
    try {
      const response: any = await dispatch(createCountry(values));
      if (response?.type === "countries/create/fulfilled") {
        toast.success(country ? "Country Updated Successfully" : "Country Added Successfully");
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving country:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white  rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 bg-inherit z-10 pb-3 border-b border-gray-200 ">
          <h2 className="text-2xl font-extrabold text-gray-800 ">
            {country ? "Edit Country" : "Add Country"}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Country Name */}
              <div>
                <label className="block font-semibold text-gray-700  mb-1">
                  Country Name
                </label>
                <Field
                  name="name"
                  type="text"
                  placeholder="United States"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100   text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* ISO Code */}
              <div>
                <label className="block font-semibold text-gray-700  mb-1">ISO Code</label>
                <Field
                  name="isoCode"
                  type="text"
                  maxLength={2}
                  placeholder="US"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100   uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="isoCode" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* ISO3 Code */}
              <div>
                <label className="block font-semibold text-gray-700  mb-1">ISO3 Code</label>
                <Field
                  name="iso3Code"
                  type="text"
                  maxLength={3}
                  placeholder="USA"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100   uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="iso3Code" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Currency */}
              <div>
                <label className="block font-semibold text-gray-700  mb-1">Currency Code</label>
                <Field
                  name="currency"
                  type="text"
                  maxLength={3}
                  placeholder="USD"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100   uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="currency" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Phone Code */}
              <div>
                <label className="block font-semibold text-gray-700  mb-1">Phone Code</label>
                <Field
                  name="phoneCode"
                  type="text"
                  placeholder="+1"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100   text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage name="phoneCode" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-2">
                <Field
                  name="isActive"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
                />
                <label className="text-gray-700  select-none">Active</label>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 ">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg font-semibold bg-gray-200  text-gray-700  hover:bg-gray-300  transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                >
                  {isSubmitting && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {isSubmitting ? (country ? "Updating..." : "Adding...") : country ? "Update Country" : "Add Country"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCountryModal;
