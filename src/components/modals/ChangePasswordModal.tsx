"use client";

import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "@/lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface InputProps {
  name: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  touched?: boolean;
  show: boolean;
  setShow: (show: boolean) => void;
}

const InputWithToggle: React.FC<InputProps> = ({
  name,
  placeholder,
  type,
  value,
  onChange,
  onBlur,
  error,
  touched,
  show,
  setShow,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setShow(!show);
    setTimeout(() => {
      inputRef.current?.focus();
      const len = inputRef.current?.value.length || 0;
      inputRef.current?.setSelectionRange(len, len);
    }, 0);
  };

  return (
    <div className="relative w-full">
      <input
        type={show ? "text" : type}
        name={name}
        placeholder={placeholder}
        ref={inputRef}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
        className={`w-full px-4 py-2 rounded border ${touched && error ? "border-red-500" : "border-gray-300"
          } text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10`}
      />
      <button
        type="button"
        onClick={handleToggle}
        tabIndex={-1}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
      {touched && error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
};

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // console.log("---- values -----", values);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response:any = await api({
          url: "/admin/change-password",
          method: "POST",
          data: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
        });
        if (response?.message === "Password changed successfully")
          toast.success("Password changed successfully!");

        onClose();
      } catch (err) {
        // console.log("---- error in the change password ---", err)
        toast.error(err?.response?.data?.message || "Failed to change password");
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
          Change Password
        </h2>
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <InputWithToggle
            name="currentPassword"
            placeholder="Current Password"
            type="password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.currentPassword}
            touched={formik.touched.currentPassword}
            show={showCurrent}
            setShow={setShowCurrent}
          />
          <InputWithToggle
            name="newPassword"
            placeholder="New Password"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.newPassword}
            touched={formik.touched.newPassword}
            show={showNew}
            setShow={setShowNew}
          />
          <InputWithToggle
            name="confirmPassword"
            placeholder="Confirm New Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
          />
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
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
