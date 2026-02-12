"use client";

import { Formik, FieldArray } from "formik";
import { FiTrash2 } from "react-icons/fi";
import { useCMS } from "@/components/useCMS";
import { template2Schema } from "@/lib/templateSchema";
import FormikSync from "@/lib/formikSync";
import { resolveImageUrl } from "@/utils/ResolveImage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Template2({ section }: any) {
  const { cmsData, updateSection } = useCMS();

  return (
    <Formik
      enableReinitialize
      validationSchema={template2Schema}
      initialValues={{
        ...section.data,
        imageFile: section.data.imageFile ?? null,
        imagePreview: section.data.imagePreview ?? "",
      }}
      onSubmit={() => { }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
      }) => {
        console.log("-=-=-=-= values.imagePreview || values.image -=--==-=-=-", values);
        return (
          <form onSubmit={handleSubmit} className="py-16 bg-gray-50">
            <FormikSync
              onChange={(vals) => updateSection(section.id, vals)}
            />
            <div className="max-w-6xl mx-auto px-6 space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* LEFT – CONTENT */}
                <div className="rounded-xl border bg-white p-6 space-y-6">

                  {/* STEP NUMBER */}
                  <input
                    name="stepNumber"
                    value={values.stepNumber}
                    onChange={handleChange}
                    placeholder="01"
                    className="w-20 text-black border-gray-300 rounded-full border px-3 py-2 text-center"
                  />

                  {/* HEADING */}
                  <textarea
                    name="heading"
                    value={values.heading}
                    onChange={handleChange}
                    placeholder="Pick Your Plan"
                    className="w-full text-black border-gray-300 border px-4 py-3 text-2xl font-bold"
                  />

                  {/* PARAGRAPHS */}
                  <FieldArray name="description.paragraphs">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.description.paragraphs.map((_, index) => (
                          <div
                            key={index}
                            className="flex gap-2 items-start"
                          >
                            <textarea
                              name={`description.paragraphs.${index}.content`}
                              value={values?.description.paragraphs[index]?.content}
                              onChange={handleChange}
                              className="flex-1 text-black border-gray-300 border p-3"
                              rows={3}
                            />

                            {values.description.paragraphs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                <FiTrash2 className="text-red-500 mt-2" />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            push({ id: Date.now(), content: "" })
                          }
                          className="text-green-500 cursor-pointer text-sm font-medium"
                        >
                          + Add Paragraph
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* RIGHT – IMAGE */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                  <label className="text-sm font-medium text-gray-600">
                    Upload Image
                  </label>

                  <label className="relative flex h-64 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed">
                    {values.imagePreview || values.image ? (
                      <img
                        src={values.imagePreview || resolveImageUrl(values.image)}
                        className="h-full w-full object-cover rounded-lg"
                        alt="Preview"
                      />
                    ) : (
                      <span className="text-gray-400">
                        Click to upload image
                      </span>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setFieldValue("imageFile", file);
                        setFieldValue("imagePreview", URL.createObjectURL(file));
                      }}
                    />
                  </label>


                </div>
              </div>

              {/* SAVE */}
              {/* <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-2 rounded-lg"
              >
                Save Template 2
              </button>
            </div> */}
            </div>
          </form>
        )
      }}
    </Formik>
  );
}
