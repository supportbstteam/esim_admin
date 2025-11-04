"use client";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { checkAuth } from "@/store/slice/userSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup"
// ------------------ Communication Mail (Single) ------------------
const communicationMailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Communication email is required"),
});

export const CommunicationMailManagement = () => {
    // const {user} = 
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [initialEmail, setInitialEmail] = useState("");

    // console.log("---- user ----", user);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setInitialEmail(user?.notificationMail);
            } catch (err) {
                console.error("Failed to fetch communication mail", err);
            }
        };
        fetchData();
    }, [user?.id]);

    return (
        <Formik
            enableReinitialize
            initialValues={{ email: initialEmail }}
            validationSchema={communicationMailSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setLoading(true);
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const response: any = await api({
                        url: "/admin/change-notification-mail",
                        method: "POST",
                        data: {
                            notificationMail: values?.email
                        }
                    });
                    // await dispatch(checkAuth());

                    // console.log("---- response in the mail change ----", response);

                    if (response?.message === "Notification mail updated successfully for all admins") {
                        toast.success("Notification mail Updated");
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (err: any) {
                    console.error("----error in the communication mail ----", err);
                    toast.error(err?.message || "Something went wrong ❌");
                } finally {
                    setLoading(false);
                    setSubmitting(false);
                }
            }}
        >
            {({ values, isValid, dirty }) => (
                <Form>
                    <div className="border rounded shadow-sm mb-6 border-[#808080] relative">
                        <div className="p-4">
                            <h3 className="text-xl text-black font-semibold mb-2">
                                Communication Mail
                            </h3>

                            {/* Email Field */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-4">
                                <div className="flex-1">
                                    <Field
                                        name="email"
                                        placeholder="Enter communication email"
                                        className="border border-black text-black px-2 py-1 rounded w-full"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    disabled={!isValid || !dirty || loading}
                                    className={`flex cursor-pointer  items-center justify-center gap-2 px-4 py-2 rounded-md text-white ${loading
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-[#243c50] hover:bg-[#1e2f3d]"
                                        }`}
                                >
                                    {loading && (
                                        <Loader2 className="animate-spin h-4 w-4 text-white" />
                                    )}
                                    {loading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
