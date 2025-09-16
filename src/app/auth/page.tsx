"use client";

import CustomButton from "@/components/customs/CustomButton";
import CustomInput from "@/components/customs/CustomInput";
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

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export default function AuthPage() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (values: { username: string; password: string }) => {
    const { username, password } = values;

    if (!username && !password) {
      return toast.error("Invalid Credientials")
    }

    try {
      const response: any = await api({
        method: "POST",
        url: "/admin/login",
        data: {
          username: values?.username,
          password: values?.password
        }
      });

      const { token, status, } = response;

      if (status === 200) {
        toast.success("Login Successfull");
        Cookies.set('token', token);

        await dispatch(checkAuth());
        router.push('/')
      }

      // console.log("----- response ----", response);
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Username */}
          <div>
            <Field
              name="username"
              as={CustomInput}
              type="text"
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
            <Field
              name="password"
              as={CustomInput}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
            <ErrorMessage
              name="password"
              component="p"
              className="mt-1 text-sm text-red-500"
            />
          </div>

          {/* Submit */}
          <CustomButton
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </CustomButton>
        </Form>
      )}
    </Formik>
  );
}
