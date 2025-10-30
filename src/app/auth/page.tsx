"use client";

import CustomButton from "@/components/customs/CustomButton";
import { api } from "@/lib/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { checkAuth } from "@/store/slice/userSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch } from "@/store";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

export default function AuthPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showerorr, setShowerorr] = useState(false);

  const handleSubmit = async (values: { username: string; password: string; rememberMe: boolean }) => {
    try {
      const { username, password, rememberMe } = values;
      if (!username || !password) return toast.error("Invalid Credentials");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api({
        method: "POST",
        url: "/admin/login",
        data: { username, password },
      });

      const { token, status } = response;
      if (status === 200) {
        toast.success("Login Successful");

        // ✅ handle remember me logic
        if (rememberMe) {
          Cookies.set("token", token, { expires: 7 }); // 7 days persistent
          router.push("/");
        } else {
          Cookies.set("token", token, { expires: 1 }); // session cookie
          // router.push("/");
        }

        await dispatch(checkAuth());
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setShowerorr(true);
      setTimeout(() => setShowerorr(false), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex w-[900px] h-[550px] rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section */}
        <div className="w-1/2 bg-gradient-to-b from-emerald-500 to-emerald-900 flex flex-col justify-center items-center p-10 text-white">
          <Image
            src="/FullLogo.png"
            alt="Logo"
            width={150}
            height={150}
            className="mx-auto mb-4 rounded-2xl"
          />
          <h2 className="text-2xl font-semibold">Welcome Back</h2>
          <p className="text-center text-sm mt-3 opacity-90 max-w-sm">
            Log in to access your dashboard, manage your account, and explore all
            the features.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-white flex flex-col justify-center px-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Login</h2>
          <Formik
            initialValues={{ username: "", password: "", rememberMe: false }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, handleChange }) => (
              <Form className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    name="username"
                    type="text"
                    onChange={handleChange}
                    value={values.username}
                    className="border border-emerald-500 rounded-md w-full px-3 py-2 focus:outline-none bg-white text-gray-900"
                    placeholder="Username"
                  />
                  <ErrorMessage
                    name="username"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange}
                      value={values.password}
                      placeholder="Password"
                      className="border border-emerald-500 rounded-md w-full px-3 py-2 focus:outline-none bg-white text-gray-900 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* ✅ Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 bg-white text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={values.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 bg-white text-emerald-500 border-emerald-500 rounded"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                {/* Submit */}
                <CustomButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </CustomButton>
              </Form>
            )}
          </Formik>

          {/* Error Toast */}
          <div
            className={`mt-4 bg-red-500 text-white fixed top-0 py-3 px-5 font-bold rounded-2xl right-[20px] text-sm transition-all duration-500 ${showerorr ? "opacity-100 translate-x-0" : "translate-x-5 opacity-0"
              }`}
          >
            Invalid Credentials
          </div>
        </div>
      </div>
    </div>
  );
}
