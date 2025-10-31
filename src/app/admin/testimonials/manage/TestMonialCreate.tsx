import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AppDispatch } from '@/store';
import { createTestimonial } from '@/store/slice/testimonialsSlice';
import { Toggle } from '@/components/ui/Toggle';

// ✅ Validation Schema
const TestimonialSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  profession: Yup.string(),
  content: Yup.string().required('Content is required'),
  active: Yup.boolean().required(), // ✅ Include toggle in Yup
});

// ✅ Initial Values
const initialValues = {
  name: '',
  profession: '',
  content: '',
  active: true,
};

function TestMonialCreate() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-black">Add Testimonial</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={TestimonialSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await dispatch(createTestimonial(values));
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
            <div className="flex justify-between items-center mt-6">
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
                className={`bg-green-500 text-white px-4 py-2 rounded font-medium transition
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Create Testimonial'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TestMonialCreate;
