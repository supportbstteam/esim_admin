"use client";

import { Formik, FieldArray } from "formik";
import { FiTrash2 } from "react-icons/fi";
import { useCMS } from "../useCMS";
import { template1Schema } from "@/lib/templateSchema";
import FormikSync from "@/lib/formikSync";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Template1({ section }: any) {
  const { cmsData, updateSection } = useCMS();
  console.log("-=-=-=-= section data in the template 1 -=-=-=-=-", section?.data);
  return (
    <Formik
      enableReinitialize
      validationSchema={template1Schema}
      initialValues={section.data}
      onSubmit={() => { }}
    >
      {({ values, handleChange }) => {


        // useEffect(() => {
        //   updateSection(section.id, values);
        // }, [values]);


        return (
          <form
            // onSubmit={handleSubmit}
            className="bg-gray-100 border-1 border-gray-300 rounded-l-md py-16"
          >

            <FormikSync
              onChange={(vals) => updateSection(section.id, vals)}
            />
            <div className="max-w-7xl mx-auto px-6">

              {/* MAIN CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* LEFT SIDE */}
                <div className="space-y-4">

                  {/* SMALL HEADING */}
                  <input
                    name="heading"
                    value={values.heading}
                    onChange={handleChange}
                    placeholder="How it works"
                    className="w-full text-sm font-medium tracking-wide uppercase text-gray-700 border border-gray-300 px-3 py-2 rounded"
                  />

                  {/* BIG SUB HEADING */}
                  <textarea
                    name="subHeading"
                    value={values.subHeading}
                    onChange={handleChange}
                    placeholder="The Smarter Way to Stay Connected"
                    rows={3}
                    className="w-full text-4xl font-bold text-black border border-gray-300 px-4 py-3 rounded resize-none"
                  />
                </div>

                {/* RIGHT SIDE – PARAGRAPHS */}
                <div className="space-y-6">
                  <FieldArray name="description.paragraphs">
                    {({ push, remove }) => {

                      return (
                        <>
                          {values.description.paragraphs.map(
                            (_, index) => {
                              console.log("description.paragraphs.${index}.content", values?.description.paragraphs[index].content)
                              return (
                                <div
                                  key={index}
                                  className="relative"
                                >
                                  <textarea
                                    name={`description.paragraphs.${index}.content`}   // ✅ CORRECT
                                    value={values.description.paragraphs[index].content} // ✅ REQUIRED
                                    onChange={handleChange}
                                    placeholder="Write paragraph content here…"
                                    rows={4}
                                    className="w-full text-black text-base leading-relaxed border border-gray-300 px-4 py-3 rounded resize-none"
                                  />

                                  {values.description.paragraphs.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="absolute -right-10 top-2"
                                    >
                                      <FiTrash2 className="text-red-500 hover:text-red-600" />
                                    </button>
                                  )}
                                </div>
                              )
                            }
                          )}

                          <button
                            type="button"
                            onClick={() => push({ content: "" })}
                            className="text-green-500 cursor-pointer text-sm font-medium"
                          >
                            + Add Paragraph
                          </button>
                        </>
                      )
                    }}
                  </FieldArray>
                </div>
              </div>
            </div>
          </form>
        )
      }}
    </Formik>
  );
}
