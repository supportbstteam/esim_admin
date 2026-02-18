"use client";

import { Formik, FieldArray } from "formik";
import { FiTrash2 } from "react-icons/fi";

import { useCMS } from "@/components/useCMS";
import { template2Schema } from "@/lib/templateSchema";
import FormikSync from "@/lib/formikSync";

import ParagraphEditor from "@/components/common/ParagraphEditor";
import HeadingInput from "@/components/common/HeadingInput";

import { resolveImageUrl } from "@/utils/ResolveImage";



/* ================= TYPES ================= */

interface Paragraph {
  id?: number;
  content: string;
}

interface Template2Values {
  stepNumber: string;
  heading: string;
  description: {
    paragraphs: Paragraph[];
  };
  image?: string;
  imageFile?: File | null;
  imagePreview?: string;
}

interface Props {
  section: {
    id: string;
    data: Template2Values;
  };
}



/* ================= MAIN ================= */

export default function Template2({
  section,
}: Props) {

  const { updateSection } =
    useCMS();

  return (

    <Formik<Template2Values>

      enableReinitialize

      validationSchema={
        template2Schema
      }

      initialValues={{
        ...section.data,

        imageFile:
          section.data.imageFile ??
          null,

        imagePreview:
          section.data.imagePreview ??
          "",

        description: {
          paragraphs:
            section.data.description
              ?.paragraphs?.length
              ? section.data
                .description
                .paragraphs
              : [
                {
                  id: Date.now(),
                  content:
                    "<p>New paragraph...</p>",
                },
              ],
        },

      }}

      onSubmit={() => { }}

    >

      {({
        values,
        setFieldValue,
        handleChange,
      }) => (

        <form className="py-16 bg-gray-50">

          <FormikSync
            onChange={(vals) =>
              updateSection(
                section.id,
                vals
              )
            }
          />



          <div className="max-w-6xl mx-auto px-6 space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">



              {/* ================= LEFT CONTENT ================= */}

              <div className="rounded-xl border bg-white p-6 space-y-6">



                {/* STEP NUMBER */}

                <div>

                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    Step Number
                  </label>

                  <input
                    name="stepNumber"
                    value={
                      values.stepNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="01"
                    className="w-20 text-black border border-gray-300 rounded-full px-3 py-2 text-center"
                  />

                </div>



                {/* HEADING EDITOR */}

                <div>

                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    Heading
                  </label>

                  <HeadingInput
                    value={
                      values.heading
                    }
                    onChange={(
                      html
                    ) =>
                      setFieldValue(
                        "heading",
                        html
                      )
                    }
                  />

                </div>



                {/* PARAGRAPHS */}

                <FieldArray name="description.paragraphs">

                  {({
                    push,
                    remove,
                  }) => (

                    <div className="space-y-4">

                      {values.description.paragraphs.map(
                        (
                          paragraph,
                          index
                        ) => (

                          <div
                            key={
                              paragraph.id ??
                              index
                            }
                            className="border border-gray-200 rounded-lg p-4 relative"
                          >

                            {/* Editor */}

                            <ParagraphEditor
                              value={
                                paragraph.content
                              }
                              onChange={(
                                html
                              ) =>
                                setFieldValue(
                                  `description.paragraphs.${index}.content`,
                                  html
                                )
                              }
                            />



                            {/* Remove */}

                            {values.description.paragraphs.length >
                              1 && (

                                <button
                                  type="button"
                                  onClick={() =>
                                    remove(
                                      index
                                    )
                                  }
                                  className="absolute top-2 right-2"
                                >
                                  <FiTrash2 className="text-red-500 hover:text-red-600 cursor-pointer" />
                                </button>

                              )}

                          </div>

                        )
                      )}



                      {/* Add */}

                      <button
                        type="button"
                        onClick={() =>
                          push({
                            id: Date.now(),
                            content:
                              "<p>New paragraph...</p>",
                          })
                        }
                        className="text-green-600 font-medium"
                      >
                        + Add Paragraph
                      </button>

                    </div>

                  )}

                </FieldArray>



              </div>



              {/* ================= RIGHT IMAGE ================= */}

              <div className="rounded-xl border bg-white p-6 space-y-4">

                <label className="text-xs font-bold text-gray-500 uppercase block">
                  Upload Image
                </label>



                <label className="relative flex h-64 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed">

                  {values.imagePreview ||
                    values.image ? (

                    <img
                      src={
                        values.imagePreview ||
                        resolveImageUrl(
                          values.image
                        )
                      }
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

                      const file =
                        e.target
                          .files?.[0];

                      if (!file)
                        return;

                      setFieldValue(
                        "imageFile",
                        file
                      );

                      setFieldValue(
                        "imagePreview",
                        URL.createObjectURL(
                          file
                        )
                      );

                    }}
                  />

                </label>

              </div>



            </div>

          </div>

        </form>

      )}

    </Formik>

  );

}
