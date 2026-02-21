"use client";

import { Formik } from "formik";
import * as Yup from "yup";

import { useCMS } from "@/components/useCMS";
import FormikSync from "@/lib/formikSync";

import HeadingInput from "@/components/common/HeadingInput";

/* ================= TYPES ================= */

interface BannerValues {
  heading: string;
  subHeading: string;
}

interface Props {
  section: {
    id: string;
    data: BannerValues;
  };
}

/* ================= VALIDATION ================= */

const bannerSchema = Yup.object({

  heading:
    Yup.string()
      .required("Heading is required")
      .max(150),

  subHeading:
    Yup.string()
      .max(300),

});


/* ================= MAIN ================= */

export default function BannerTemplate({
  section,
}: Props) {

  const { updateSection } =
    useCMS();

  return (

    <Formik<BannerValues>

      enableReinitialize

      validationSchema={
        bannerSchema
      }

      initialValues={{

        heading:
          section.data.heading ??
          "",

        subHeading:
          section.data.subHeading ??
          "",

      }}

      onSubmit={() => {}}

    >

      {({

        values,
        setFieldValue,

      }) => (

        <form className="py-16 bg-gradient-to-br from-green-50 to-white">

          {/* AUTO SYNC WITH CMS */}
          <FormikSync
            onChange={(vals) =>
              updateSection(
                section.id,
                vals
              )
            }
          />



          <div className="max-w-5xl mx-auto px-6 space-y-8">



            {/* ================= HEADING ================= */}

            <div className="rounded-xl border bg-white p-6 space-y-3 shadow-sm">

              <label className="text-xs font-bold text-gray-500 uppercase block">

                Banner Heading

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



            {/* ================= SUBHEADING ================= */}

            <div className="rounded-xl border bg-white p-6 space-y-3 shadow-sm">

              <label className="text-xs font-bold text-gray-500 uppercase block">

                Banner Sub Heading

              </label>

              <HeadingInput

                value={
                  values.subHeading
                }

                onChange={(html) =>
                  setFieldValue(
                    "subHeading",
                    html
                  )
                }

              />

            </div>



          </div>

        </form>

      )}

    </Formik>

  );

}