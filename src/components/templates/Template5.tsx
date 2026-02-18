"use client";

import { Formik, FieldArray } from "formik";
import { FiTrash2 } from "react-icons/fi";

import { useCMS } from "../useCMS";
import FormikSync from "@/lib/formikSync";

import { Toggle } from "../ui/Toggle";

import HeadingInput from "@/components/common/HeadingInput";
import ParagraphEditor from "@/components/common/ParagraphEditor";



/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Template5({
  section,
}: any) {

  const { updateSection } =
    useCMS();



  /* SAFETY GUARD */

  if (!section?.data)
    return null;



  return (

    <Formik

      key={section.id}

      enableReinitialize

      initialValues={{

        heading:
          section.data.heading ??
          "<span>Section Heading</span>",

        isCollapsable:
          section.data
            .isCollapsable ??
          true,

        description: {
          paragraphs:
            section.data
              .description
              ?.paragraphs
              ?.length
              ? section.data
                  .description
                  .paragraphs
              : [
                  {
                    content:
                      "<p>New paragraph...</p>",
                  },
                ],
        },

      }}

      onSubmit={() => {}}

    >

      {({
        values,
        setFieldValue,
      }) => (

        <form className="p-6 border border-gray-300 rounded-lg space-y-6 bg-white">



          {/* Sync CMS */}

          <FormikSync
            onChange={(vals) =>
              updateSection(
                section.id,
                vals
              )
            }
          />



          {/* ================= HEADING EDITOR ================= */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-black">
              Section Heading
            </label>

            <HeadingInput
              value={
                values.heading
              }
              onChange={(html) =>
                setFieldValue(
                  "heading",
                  html
                )
              }
            />

          </div>



          {/* ================= COLLAPSABLE ================= */}

          <div>

            <label className="text-sm font-medium text-black">
              Is Collapsable?
            </label>

            <div className="flex gap-6 mt-2">

              <Toggle
                checked={
                  values.isCollapsable
                }
                onChange={() =>
                  setFieldValue(
                    "isCollapsable",
                    !values.isCollapsable
                  )
                }
              />

            </div>

          </div>



          {/* ================= PARAGRAPHS ================= */}

          <FieldArray name="description.paragraphs">

            {({
              push,
              remove,
            }) => (

              <div className="space-y-4">

                <div className="flex justify-between items-center">

                  <label className="text-sm text-black font-medium">
                    Paragraphs
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      push({
                        content:
                          "<p>New paragraph...</p>",
                      })
                    }
                    className="text-green-600 cursor-pointer text-sm font-medium"
                  >
                    + Add Paragraph
                  </button>

                </div>



                {values.description.paragraphs.map(
                  (
                    para: any,
                    index: number
                  ) => (

                    <div
                      key={index}
                      className="border border-gray-200 p-4 rounded-lg space-y-2"
                    >



                      {/* Paragraph Editor */}

                      <ParagraphEditor
                        value={
                          para.content
                        }
                        onChange={(html) =>
                          setFieldValue(
                            `description.paragraphs.${index}.content`,
                            html
                          )
                        }
                      />



                      {/* Remove */}

                      {values
                        .description
                        .paragraphs
                        .length >
                        1 && (

                        <button
                          type="button"
                          onClick={() =>
                            remove(
                              index
                            )
                          }
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        >
                          <FiTrash2 size={18} />
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
