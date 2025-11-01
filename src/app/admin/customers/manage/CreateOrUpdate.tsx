"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/store";
import {
  createAdminUser,
  updateAdminUser,
  getAllAdminUsers,
} from "@/store/slice/adminUserSlice";
import toast from "react-hot-toast";
import { Toggle } from "@/components/ui/Toggle";
import { api } from "@/lib/api";
import PageHeader from "@/components/common/PageHeader";

function CreateOrUpdate() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const isEditMode = mode === "update";

  // ✅ Fetch user data if update mode
  useEffect(() => {
    const fetchUserById = async () => {
      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await api({
          url: `/admin/users/${id}`,
          method: "GET",
        });
        if (res?.user) {
          setUserData(res.user);
          setIsActive(res.user.isVerified ?? true);
        }
      } catch (err) {
        console.error("User fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode && id) fetchUserById();
  }, [isEditMode, id]);

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
      const payload = { ...values, isActive };
      let response;

      if (isEditMode && userData?.id) {
        response = await dispatch(updateAdminUser({ id: userData.id, ...payload }));
      } else {
        response = await dispatch(createAdminUser(payload));
      }

      if (response?.type?.endsWith("/fulfilled")) {
        toast.success(isEditMode ? "User updated successfully" : "User created successfully");
        dispatch(getAllAdminUsers());
        router.push("/admin/users");
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

  // console.log("----- user data ----", userData);

  // ✅ Skeleton component for loading state
  const SkeletonField = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      ))}
      <div className="flex justify-between mt-6">
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="flex space-x-3">
          <div className="h-10 w-24 bg-gray-200 rounded" />
          <div className="h-10 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-xl p-8">
      <PageHeader
        title={isEditMode ? "Edit Customer" : "Add New Customer"}
        showAddButton={false}
      />

      {loading ? (
        <SkeletonField />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5" noValidate>
              <div>
                <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-800">
                  First Name<span className="text-red-600">*</span>
                </label>
                <Field
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-800">
                  Last Name<span className="text-red-600">*</span>
                </label>
                <Field
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">
                  Email<span className="text-red-600">*</span>
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-800">
                  {isEditMode ? "Password (optional)" : "Password"}<span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-3">
                  <Toggle checked={isActive} onChange={setIsActive} />
                  <span className="text-gray-800 text-sm font-medium">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  >
                    {isEditMode ? "Update User" : "Add User"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default CreateOrUpdate;
