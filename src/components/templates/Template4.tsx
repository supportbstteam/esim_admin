import { Formik, FieldArray } from "formik";
import { FiTrash2 } from "react-icons/fi";
import { useCMS } from "../useCMS";
import { template4Schema } from "@/lib/templateSchema";
import FormikSync from "@/lib/formikSync";
import { IconRenderer } from "../common/RenderedIcon";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Template4({ section }: any) {
  const { updateSection } = useCMS();

  return (
    <Formik
      enableReinitialize // 🔥 REQUIRED
      validationSchema={template4Schema}
      initialValues={{
        items: section.data?.items ?? [], // ✅ CORRECT SHAPE
      }}
      onSubmit={() => { }}
    >
      {({ values, handleChange }) => (
        <form className="p-6 space-y-6">

          {/* 🔄 Sync Formik → CMSProvider */}
          <FormikSync
            onChange={(vals) => updateSection(section.id, vals)}
          />

          <FieldArray name="items">
            {({ push, remove }) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {values.items.length === 0 && (
                  <div className="col-span-full text-gray-400 text-sm">
                    No cards added yet.
                  </div>
                )}

                {values.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-gray-300 p-4 space-y-3 rounded bg-white"
                  >
                    {/* ICON PREVIEW */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100">
                        <IconRenderer
                          name={item.icon}
                          size={20}
                          className="text-black"
                        />
                      </div>

                      <input
                        name={`items.${index}.icon`}
                        value={item.icon}
                        onChange={handleChange}
                        placeholder="FiWifi, FaGlobe, MdTravelExplore"
                        className="border text-black border-gray-300 p-2 w-full"
                      />
                    </div>

                    {/* TITLE */}
                    <input
                      name={`items.${index}.title`}
                      value={item.title}
                      onChange={handleChange}
                      placeholder="Title"
                      className="border text-black border-gray-300 p-2 w-full"
                    />

                    {/* DESCRIPTION */}
                    <textarea
                      name={`items.${index}.description`}
                      value={item.description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="border text-black border-gray-300 p-2 w-full"
                    />

                    {values.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-2"
                      >
                        <FiTrash2 className="text-red-500" />
                      </button>
                    )}
                  </div>
                ))}


                <button
                  type="button"
                  onClick={() =>
                    push({
                      id: Date.now(),
                      icon: "",
                      title: "",
                      description: "",
                    })
                  }
                  className="border-dashed border border-black text-black p-6 rounded"
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
