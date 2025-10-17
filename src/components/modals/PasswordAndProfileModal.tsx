"use client";

import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { checkAuth } from "@/store/slice/userSlice";

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
      {type === "password" && (
        <button
          type="button"
          onClick={handleToggle}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
      {touched && error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

const ProfileAndPasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state?.user);

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    notificationMail: Yup.string().email("Invalid email address").nullable().notRequired(),
    currentPassword: Yup.string().nullable(),
    newPassword: Yup.string().min(6, "Password must be at least 6 characters").nullable(),
    confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords must match").nullable(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || "",
      email: user?.username || "",
      notificationMail: user?.notificationMail || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
          name: values.name,
          email: values.email,
          notificationMail: values.notificationMail,
        };

        // Include password fields if filled
        if (values.newPassword) {
          if (!values.currentPassword) {
            toast.error("Current password is required to change password");
            return;
          }
          payload.currentPassword = values.currentPassword;
          payload.newPassword = values.newPassword;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await api({
          url: "/admin/update",
          method: "PUT",
          data: payload,
        });

        if (response?.message === "Profile updated successfully") {
          toast.success("Profile updated successfully!");
          await dispatch(checkAuth());
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
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile & Password</h2>
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
              className={`w-full px-4 py-2 rounded border ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
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
              className={`w-full px-4 py-2 rounded border ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                } text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Notification Mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Mail</label>
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
              <div className="text-red-500 text-xs mt-1">{formik.errors.notificationMail}</div>
            )}
          </div>

          {/* Password Fields */}
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileAndPasswordModal;
