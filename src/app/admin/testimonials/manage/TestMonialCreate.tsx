"use client";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AppDispatch, useAppSelector } from '@/store';
import { createTestimonial, getTestimonialById, updateTestimonial } from '@/store/slice/testimonialsSlice';
import { Toggle } from '@/components/ui/Toggle';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';

// ✅ Validation Schema
const TestimonialSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  profession: Yup.string(),
  content: Yup.string().required('Content is required'),
  active: Yup.boolean().required(), // ✅ Include toggle in Yup
});



function TestMonialCreate() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const { testimonial } = useAppSelector(state => state?.testimonials);

  // console.log("---- id ----", id);

  const fetchTestId = async () => {
    await dispatch(getTestimonialById(id));

  }

  useEffect(() => {
    if (id && mode === "update")
      fetchTestId();
  }, [dispatch]);


  // console.log("----- testimonial -----", testimonial?.name);

  // ✅ Initial Values
  const initialValues = {
    name: testimonial?.name || '',
    profession: testimonial?.profession || '',
    content: testimonial?.content || '',
    active: testimonial?.isActive ?? true,
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <PageHeader
        title={mode === "update" ? "Update Testimonial" : "Add Testimonial"}
        showAddButton={false}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={TestimonialSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (!id) {
            await dispatch(createTestimonial(values));
          }
          else {
            await dispatch(updateTestimonial({ id, data: values }));
          }
          router.back();
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            {/* Name */}
            <div className="mb-4">
              <label className="block mb-1 text-black font-semibold" htmlFor="name">
                Name <span className="text-red-500">*</span>
              </label>
              <Field
                name="name"
                type="text"
                placeholder="Enter name"
                className="w-full border px-3 py-2 rounded text-black placeholder-gray-300"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Profession */}
            <div className="mb-4">
              <label className="block mb-1 text-black font-semibold" htmlFor="profession">
                Profession
              </label>
              <Field
                name="profession"
                type="text"
                placeholder="Enter profession (optional)"
                className="w-full border px-3 py-2 rounded text-black placeholder-gray-300"
              />
              <ErrorMessage name="profession" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="block mb-1 text-black font-semibold" htmlFor="content">
                Testimonial <span className="text-red-500">*</span>
              </label>
              <Field
                name="content"
                as="textarea"
                placeholder="Write testimonial"
                className="w-full border px-3 py-2 rounded h-24 resize-none text-black placeholder-gray-300"
              />
              <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* ✅ Toggle + Submit Button Row */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <Toggle
                  checked={values.active}
                  onChange={(val) => setFieldValue('active', val)}
                />
                <span className="text-black font-medium">
                  {values.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <button
                type="submit"
                className={`bg-green-500 mt-6 text-white px-4 py-2 rounded font-medium transition
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : `${(mode === "update" && id && testimonial) ? "Update" : "Add"} Testimonial`}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TestMonialCreate;
