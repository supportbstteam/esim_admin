"use client";

import { Formik } from "formik";
import * as Yup from "yup";

import { useCMS } from "@/components/useCMS";
import FormikSync from "@/lib/formikSync";

import HeadingInput from "@/components/common/HeadingInput";
import UploadImage from "../customs/UploadImages";

/* ================= TYPES ================= */

// interface ImageData {
//   // base64 : string;
//   name: string;
//   size: number;
//   type: string;
//   lastModified: number;
//   width?: number;
//   height?: number;
// }

interface ImageData {
  name: string;
  size: number;
  type: string;
  url: string;
  fileName?: string;
  filePath?: string;
  width?: number;
  height?: number;
}

interface BannerValues {
  heading: string;
  subHeading: string;
  image?: ImageData | null;
}

interface Props {
  section: {
    id: string;
    data: BannerValues;
  };
}

/* ================= VALIDATION ================= */

const bannerSchema = Yup.object({
  heading: Yup.string().required("Heading is required").max(150),
  subHeading: Yup.string().max(300),
  image: Yup.object().nullable(),
});

/* ================= MAIN ================= */

export default function BannerTemplate({ section }: Props) {

  const { updateSection } = useCMS();

  return (
    <Formik<BannerValues>

      enableReinitialize

      validationSchema={bannerSchema}

      initialValues={{
        heading: section.data.heading ?? "",
        subHeading: section.data.subHeading ?? "",
        image: section.data.image ?? null,
      }}

      onSubmit={() => { }}
    >

      {({ values, setFieldValue }) => (

        <form className="py-16 bg-gradient-to-br from-green-50 to-white">

          {/* CMS AUTO SYNC */}
          <FormikSync
            onChange={(vals) =>
              updateSection(section.id, vals)
            }
          />

          <div className="max-w-5xl mx-auto px-6 space-y-8">

            {/* IMAGE */}
            <UploadImage
              image={values.image}
              setFieldValue={setFieldValue}
              name="image"
              label="Banner Image"
            />

            {/* HEADING */}
            {/* <div className="rounded-xl border bg-white p-6 space-y-3 shadow-sm">

              <label className="text-xs font-bold text-gray-500 uppercase">
                Banner Heading
              </label>

              <HeadingInput
                value={values.heading}
                onChange={(html) =>
                  setFieldValue("heading", html)
                }
              />

            </div> */}

            <div className="rounded-xl border bg-white p-6 space-y-3 shadow-sm">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Main Heading
              </label>
              <input
                value={values.heading}
                onChange={(e) => setFieldValue("heading", e.target.value)}
                placeholder="Enter heading text..."
                className="w-full border border-gray-300 rounded-md p-3 text-black focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            {/* SUB HEADIND */}
            <div className="rounded-xl border bg-white p-6 space-y-3 shadow-sm">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Sub Heading
              </label>
              <input
                value={values.subHeading}
                onChange={(e) => setFieldValue("subHeading", e.target.value)}
                placeholder="Enter heading text..."
                className="w-full border border-gray-300 rounded-md p-3 text-black focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            {/* SUBHEADING */}
            {/* <div className="rounded-xl border bg-white p-6 space-y-3 shadow-sm">

              <label className="text-xs font-bold text-gray-500 uppercase">
                Banner Sub Heading
              </label>

              <HeadingInput
                value={values.subHeading}
                onChange={(html) =>
                  setFieldValue("subHeading", html)
                }
              />

            </div> */}

          </div>

        </form>

      )}

    </Formik>
  );
}