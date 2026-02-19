"use client";

import { Formik, FieldArray } from "formik";
import { FiTrash2 } from "react-icons/fi";

import { useCMS } from "../useCMS";
import { template4Schema } from "@/lib/templateSchema";
import FormikSync from "@/lib/formikSync";

import { IconRenderer } from "../common/RenderedIcon";

import HeadingInput from "@/components/common/HeadingInput";
import ParagraphEditor from "@/components/common/ParagraphEditor";



/* ================= TYPES ================= */

interface CardItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface Props {
  section: {
    id: string;
    data: {
      items: CardItem[];
    };
  };
}



/* ================= DEFAULT CARD ================= */

const createDefaultCard = (): CardItem => ({
  id: Date.now(),
  icon: "",
  title: "<span>Card Title</span>",
  description: "<p>Card description...</p>",
});



/* ================= MAIN ================= */

export default function Template4({
  section,
}: Props) {

  const { updateSection } =
    useCMS();

  return (

    <Formik

      enableReinitialize

      validationSchema={
        template4Schema
      }

      initialValues={{
        items:
          section.data?.items
            ?.length
            ? section.data.items
            : [
                createDefaultCard(),
              ],
      }}

      onSubmit={() => {}}

    >

      {({
        values,
        handleChange,
        setFieldValue,
      }) => (

        <form className="p-6 space-y-6 bg-gray-50">

          <FormikSync
            onChange={(vals) =>
              updateSection(
                section.id,
                vals
              )
            }
          />



          <FieldArray name="items">

            {({
              push,
              remove,
            }) => (

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {values.items.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={item.id}
                      className="border border-gray-300 p-5 space-y-4 rounded-xl bg-white shadow-sm"
                    >



                      {/* ICON */}

                      <div className="space-y-2">

                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Icon
                        </label>

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100">

                            <IconRenderer
                              name={
                                item.icon
                              }
                              size={
                                20
                              }
                              className="text-black"
                            />

                          </div>



                          <input
                            name={`items.${index}.icon`}
                            value={
                              item.icon
                            }
                            onChange={
                              handleChange
                            }
                            placeholder="FiWifi"
                            className="border text-black border-gray-300 p-2 w-full rounded"
                          />

                        </div>

                      </div>



                      {/* TITLE EDITOR */}

                      <div className="space-y-2">

                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Title
                        </label>

                        <HeadingInput
                          value={
                            item.title
                          }
                          onChange={(
                            html
                          ) =>
                            setFieldValue(
                              `items.${index}.title`,
                              html
                            )
                          }
                        />

                      </div>



                      {/* DESCRIPTION EDITOR */}

                      <div className="space-y-2">

                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Description
                        </label>

                        <ParagraphEditor
                          value={
                            item.description
                          }
                          onChange={(
                            html
                          ) =>
                            setFieldValue(
                              `items.${index}.description`,
                              html
                            )
                          }
                        />

                      </div>



                      {/* REMOVE */}

                      {values.items.length >
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



                {/* ADD CARD */}

                <button
                  type="button"
                  onClick={() =>
                    push(
                      createDefaultCard()
                    )
                  }
                  className="border-dashed border-2 border-gray-400 text-gray-600 p-6 rounded-xl hover:border-black hover:text-black transition-all"
                >
                  + Add Card
                </button>



              </div>

            )}

          </FieldArray>



        </form>

      )}

    </Formik>

  );

}
