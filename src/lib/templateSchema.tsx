import * as Yup from "yup";

export const paragraphSchema = Yup.object({
  content: Yup.string().required("Paragraph is required"),
});

export const template1Schema = Yup.object({
  heading: Yup.string().required("Heading required"),
  subHeading: Yup.string().required("Sub heading required"),
  description: Yup.object({
    paragraphs: Yup.array().of(paragraphSchema).min(1),
  }),
});

export const template4Schema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object({
        icon: Yup.string().required(),
        title: Yup.string().required(),
        description: Yup.string().required(),
      })
    )
    .min(1),
});

export const template2Schema = Yup.object({
  stepNumber: Yup.string().required("Step number required"),
  heading: Yup.string().required("Heading required"),
  image: Yup.string().required("Image required"),
  description: Yup.object({
    paragraphs: Yup.array()
      .of(paragraphSchema)
      .min(1, "At least one paragraph required"),
  }),
});

export const template3Schema = template2Schema; // same structure
