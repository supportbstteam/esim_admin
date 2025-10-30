"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/store";
import {
  createAdminUser,
  getAllAdminUsers,
  updateAdminUser,
} from "@/store/slice/adminUserSlice";
import toast from "react-hot-toast";

function CreateOrUpdate() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // can be "create" or a user id
  const [userData, setUserData] = useState<{
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch user if mode is an id
  useEffect(() => {
    const fetchUser = async () => {
      if (mode && mode !== "create") {
        try {
          const response = await fetch(`/api/admin-users/${mode}`); // replace with your backend endpoint
          const data = await response.json();
          if (response.ok) setUserData(data);
          else toast.error("Failed to fetch user data");
        } catch (err) {
          console.error(err);
          toast.error("Error fetching user");
        }
      }
    };
    fetchUser();
  }, [mode]);

  const isEditMode = mode !== "create";

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().min(2).required("First name required"),
    lastName: Yup.string().trim().min(2).required("Last name required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: isEditMode
      ? Yup.string().min(6)
      : Yup.string().min(6).required("Password required"),
  });

  const initialValues = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    password: "",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      let response;
      if (isEditMode && userData?.id) {
        response = await dispatch(updateAdminUser({ id: userData.id, ...values }));
      } else {
        response = await dispatch(createAdminUser(values));
      }

      if (response?.type?.endsWith("/fulfilled")) {
        toast.success(isEditMode ? "Updated user successfully" : "Created new user successfully");
        dispatch(getAllAdminUsers());
        router.push("/admin/users"); // ✅ redirect back after submit
      } else {
        toast.error(response?.payload?.data?.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error in CreateOrUpdate:", err);
      toast.error("Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditMode && !userData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-xl p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        {isEditMode ? "Edit Customer" : "Add New Customer"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5" noValidate>
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-800">
                First Name<span className="text-red-600">*</span>
              </label>
              <Field
                id="firstName"
                name="firstName"
                type="text"
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-800">
                Last Name<span className="text-red-600">*</span>
              </label>
              <Field
                id="lastName"
                name="lastName"
                type="text"
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">
                Email<span className="text-red-600">*</span>
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-800">
                {isEditMode ? "Password (optional)" : "Password"}<span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800"
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
                onClick={() => router.back()}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                {isEditMode ? "Update User" : "Add User"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateOrUpdate;
