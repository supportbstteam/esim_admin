"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AppDispatch, useAppSelector } from "@/store";
import {
  createFaq,
  getFaqById,
  updateFaq,
} from "@/store/slice/faqSlice";
import { Toggle } from "@/components/ui/Toggle";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import PageHeader from "@/components/common/PageHeader";

// ✅ Validation Schema
const FaqSchema = Yup.object().shape({
  question: Yup.string().required("Question is required"),
  answer: Yup.string().required("Answer is required"),
  order: Yup.number()
    .min(0, "Order must be a non-negative number")
    .nullable(),
  active: Yup.boolean().required(),
});

function FaqCreate() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const { faq, loading } = useAppSelector((state) => state.faqs);

  // ✅ Fetch existing FAQ when updating
  useEffect(() => {
    if (mode === "update" && id) {
      dispatch(getFaqById(id));
    }
  }, [dispatch, id, mode]);

  // ✅ Initial Values
  const initialValues = {
    question: faq?.question || "",
    answer: faq?.answer || "",
    order: faq?.order ?? 0,
    active:
      typeof faq?.isActive === "boolean" ? faq?.isActive : true,
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <PageHeader
        title={mode === "update" ? "Update FAQ" : "Add FAQ"}
        showAddButton={false}
      />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={FaqSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const payload = {
              question: values.question.trim(),
              answer: values.answer.trim(),
              order: Number(values.order) || 0,
              isActive: values.active,
            };

            if (mode === "update" && id) {
              await dispatch(updateFaq({ id, data: payload }));
              toast.success("FAQ updated successfully!");
            } else {
              await dispatch(createFaq(payload));
              toast.success("FAQ created successfully!");
            }

            router.push("/admin/faqs");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
          } finally {
            setSubmitting(false);
            resetForm();
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            {/* ✅ Question Field */}
            <div className="mb-4">
              <label
                htmlFor="question"
                className="block mb-1 text-gray-800 font-semibold"
              >
                Question <span className="text-red-500">*</span>
              </label>
              <Field
                name="question"
                type="text"
                placeholder="Enter question"
                className="w-full border px-3 py-2 rounded text-black placeholder-gray-400"
              />
              <ErrorMessage
                name="question"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* ✅ Answer Field */}
            <div className="mb-4">
              <label
                htmlFor="answer"
                className="block mb-1 text-gray-800 font-semibold"
              >
                Answer <span className="text-red-500">*</span>
              </label>
              <Field
                name="answer"
                as="textarea"
                rows={4}
                placeholder="Write FAQ answer"
                className="w-full border px-3 py-2 rounded resize-none text-black placeholder-gray-400"
              />
              <ErrorMessage
                name="answer"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* ✅ Order Field */}
            <div className="mb-4">
              <label
                htmlFor="order"
                className="block mb-1 text-gray-800 font-semibold"
              >
                Order
              </label>
              <Field
                name="order"
                type="number"
                placeholder="Enter display order (optional)"
                className="w-full border px-3 py-2 rounded text-black placeholder-gray-400"
              />
              <ErrorMessage
                name="order"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* ✅ Active Toggle */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <Toggle
                  checked={values.active}
                  onChange={(val) => setFieldValue("active", val)}
                />
                <span className="text-black font-medium">
                  {values.active ? "Active" : "Inactive"}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`bg-green-500 cursor-pointer mt-5 text-white px-5 py-2 rounded-lg font-semibold transition ${isSubmitting || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600"
                  }`}
              >
                {isSubmitting || loading
                  ? "Saving..."
                  : mode === "update"
                    ? "Update FAQ"
                    : "Add FAQ"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FaqCreate;
