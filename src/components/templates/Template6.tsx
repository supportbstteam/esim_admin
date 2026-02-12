import { Formik } from "formik";
import { useCMS } from "../useCMS";
import FormikSync from "@/lib/formikSync";
import { resolveImageUrl } from "@/utils/ResolveImage";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Template6({ section }: any) {
  const { updateSection } = useCMS();

  if (!section?.data) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFieldValue("imageFile", file);        // for upload
    setFieldValue("imagePreview", previewUrl); // for UI
  };

  return (
    <Formik
      key={section.id}
      enableReinitialize
      initialValues={{
        image: section.data.image ?? "",
        imageFile: section.data.imageFile ?? null,
        imagePreview: section.data.imagePreview ?? "",
      }}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => {
        const imageSrc = values.imagePreview
          ? values.imagePreview
          : resolveImageUrl(values.image);

          console.log("-=-=-=-=- imegsrc -=-=-=-=",imageSrc);

        return (
          <form className="p-6 space-y-4">
            {/* 🔄 Sync Formik → CMS */}
            <FormikSync
              onChange={(vals) =>
                updateSection(section.id, vals)
              }
            />

            <label className="block text-sm font-medium text-black">
              Banner Image
            </label>

            {/* UPLOAD CONTAINER */}
            <label className="relative block w-full cursor-pointer">
              <div
                className="
                  w-full h-[320px]
                  border-2 border-dashed border-gray-300
                  rounded-xl
                  flex items-center justify-center
                  overflow-hidden
                  bg-gray-50 hover:bg-gray-100
                  transition
                "
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Banner Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">
                    Click to upload banner image
                  </span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e, setFieldValue)
                }
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-500">
              Recommended: High-resolution landscape image (Hero / Banner)
            </p>
          </form>
        );
      }}
    </Formik>
  );
}
