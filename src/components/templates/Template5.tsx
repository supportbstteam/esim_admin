import { Formik, FieldArray } from "formik";
import { FiTrash2 } from "react-icons/fi";
import { useCMS } from "../useCMS";
import FormikSync from "@/lib/formikSync";
import { Toggle } from "../ui/Toggle";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Template5({ section }: any) {
  const { updateSection } = useCMS();

  // 🔒 SAFETY GUARD
  if (!section?.data) return null;

  return (
    <Formik
      key={section.id} // ✅ THIS IS THE FIX
      enableReinitialize
      initialValues={{
        heading: section.data.heading ?? "",
        isCollapsable:
          section.data.isCollapsable ?? true,
        description: {
          paragraphs:
            section.data.description?.paragraphs?.length
              ? section.data.description.paragraphs
              : [{ content: "" }],
        },
      }}
      onSubmit={() => { }}
    >
      {({ values, handleChange, setFieldValue }) => (
        <form className="p-6 border border-black space-y-6">

          {/* 🔄 Sync Formik → CMS */}
          <FormikSync
            onChange={(vals) =>
              updateSection(section.id, vals)
            }
          />

          {/* HEADING */}
          <div>
            <label className="text-sm font-medium text-black">
              Section Heading
            </label>
            <input
              name="heading"
              value={values.heading}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded text-black"
            />
          </div>

          {/* COLLAPSABLE */}
          <div>
            <label className="text-sm font-medium text-black">
              Is Collapsable?
            </label>
            <div className="flex gap-6 mt-2">

              <Toggle
                checked={values?.isCollapsable}
                onChange={() =>
                  setFieldValue("isCollapsable", !values?.isCollapsable)
                }
              />
            </div>
          </div>

          {/* PARAGRAPHS */}
          <FieldArray name="description.paragraphs">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm text-black font-medium">
                    Paragraphs
                  </label>
                  <button
                    type="button"
                    onClick={() => push({ content: "" })}
                    className="text-green-500 cursor-pointer text-sm font-medium"
                  >
                    + Add Paragraph
                  </button>
                </div>

                {values.description.paragraphs.map(
                  (para: any, index: number) => (
                    <div
                      key={index}
                    // className="border border-gray-300 p-4 rounded"
                    >
                      <textarea
                        name={`description.paragraphs.${index}.content`}
                        value={para.content}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded text-black"
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
                  )
                )}
              </div>
            )}
          </FieldArray>
        </form>
      )}
    </Formik>
  );
}
