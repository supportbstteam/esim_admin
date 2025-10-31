"use client";

import { useAppDispatch, useAppSelector } from '@/store';
import { Loader2, LucideTrash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createSocials, getSocials, updateSocial } from '@/store/slice/socialSlice';
import { createContacts, getContacts, updateContact } from '@/store/slice/contactSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CommunicationMailManagement } from '@/components/container/CommunicationMail';
// Profile component remains unchanged -- updated the vercel

const socialSchema = Yup.object().shape({
  socials: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required("Social type is required"),
      link: Yup.string()
        .transform((value) => {
          // Auto prepend https:// if missing
          if (value && !/^https?:\/\//i.test(value)) {
            return `https://${value}`;
          }
          return value;
        })
        .url("Invalid URL format")
        .required("Social link is required"),
    })
  ),
});

function SocialMediaManagement() {
  const dispatch = useAppDispatch();
  const { items: socials } = useAppSelector((state) => state.socials);
  const { user } = useAppSelector((state) => state.user);

  // console.log("--- socials ---", socials);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getSocials());
      await dispatch(getContacts());
    }
    fetchData();
  }, [user?.id])

  return (
    <Formik
      initialValues={{ socials: socials.length ? socials : [{ type: "Facebook", link: "" }] }}
      validationSchema={socialSchema}
      enableReinitialize
      onSubmit={async (values) => {
        const createList = values.socials.filter((s) => !s.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateList: any = values.socials.filter((s) => s.id);

        try {
          if (createList.length) {
            await dispatch(createSocials(createList));
            toast.success(`${createList.length} social(s) created successfully ✅`);
          }
          for (const s of updateList) {
            await dispatch(updateSocial({ id: s.id!, ...s }));
            toast.success(`Social "${s.type}" updated successfully ✅`);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          toast.error(err?.message || "Something went wrong ❌");
        }
      }}
    >
      {({ values, isValid, dirty }) => (
        <Form>
          <FieldArray name="socials">
            {({ push, remove }) => (
              <div className="border rounded shadow-sm mb-6 border-[#808080] relative">
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-black">Social Media</h3>
                  {values.socials.map((_, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3 mb-3">
                      <div className="flex flex-col">
                        <Field
                          name={`socials[${index}].type`}
                          placeholder="Type"
                          className="border text-black border-black px-2 py-1 rounded"
                        />
                        <ErrorMessage
                          name={`socials[${index}].type`}
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      <div className="flex flex-col">
                        <Field
                          name={`socials[${index}].link`}
                          placeholder="URL"
                          className="border text-black border-black px-2 py-1 rounded"
                        />
                        <ErrorMessage
                          name={`socials[${index}].link`}
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 cursor-pointer  font-bold px-2 py-1 hover:bg-red-100 cursor-pointer rounded"
                      >
                        <LucideTrash2 />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="bg-amber-600 cursor-pointer  p-2 rounded-md"
                    onClick={() => push({ type: "", link: "" })}
                  >
                    + Add Social
                  </button>
                  <button
                    type="submit"
                    className="bg-[#243c50] cursor-pointer  p-2 rounded-md absolute right-2 bottom-2 cursor-pointer"
                    disabled={!isValid || !dirty}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
}

const contactSchema = Yup.object().shape({
  contacts: Yup.array()
    .of(
      Yup.object().shape({
        // ---- Contact Type ----
        type: Yup.string().required("Contact type is required"),

        // ---- Value Validation (depends on Type) ----
        value: Yup.string().when("type", {
          is: (val: unknown) => !!val,
          then: (schema) =>
            schema.test(
              "value-validation",
              "Invalid value",
              function (val: unknown) {
                const type = this.parent.type;

                let t = "";
                if (typeof type === "string") {
                  t = type.toLowerCase();
                } else if (Array.isArray(type)) {
                  t = type[0]?.toLowerCase() ?? "";
                }

                if (!val) return false; // required

                if (t === "email") {
                  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val as string);
                } else if (t === "phone") {
                  return /^\+?[0-9\s-]{10,15}$/.test(val as string);
                } else if (t === "address" || t === "other") {
                  return (val as string).trim().length > 0;
                }

                return false; // default fail
              }
            ).required("Value is required"),
          otherwise: (schema) => schema.required("Value is required"),
        }),

        // ---- Position (Optional) ----
        position: Yup.string()
          .max(100, "Position must be under 100 characters")
          .nullable(),
      })
    )
    .min(1, "At least one contact information is required")
    .required("Please provide at least one contact"),
});

const ContactUsManagement = () => {
  const dispatch = useAppDispatch();
  const { items: contacts } = useAppSelector((state) => state.contacts);
  const { user } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getSocials());
      await dispatch(getContacts());
    };
    fetchData();
  }, [dispatch, user?.id]);

  return (
    <Formik
      initialValues={{
        contacts: contacts.length
          ? contacts
          : [{ type: "Phone", value: "", position: "" }],
      }}
      validationSchema={contactSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting, validateForm }) => {
        setLoading(true);

        const validationErrors = await validateForm(values);
        if (Object.keys(validationErrors).length > 0) {
          toast.error("Please fix validation errors before submitting ❌");
          setLoading(false);
          setSubmitting(false);
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createList = values.contacts.filter((c: any) => !c.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateList: any = values.contacts.filter((c: any) => c.id);

        try {
          if (createList.length) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await dispatch(createContacts(createList));

            if (res.error) {
              // Backend error handled here
              console.error("❌ Backend error creating contacts:", res.error);
              const errMsg =
                res.error?.message ||
                res.payload?.message ||
                "Failed to create contacts.";
              toast.error(errMsg);
            } else {
              toast.success(`${createList.length} contact(s) created successfully ✅`);
            }
          }

          for (const c of updateList) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await dispatch(updateContact({ id: c.id!, ...c }));

            if (res.error) {
              console.error("❌ Backend error updating contact:", res.error);
              const errMsg =
                res.error?.message ||
                res.payload?.message ||
                `Failed to update contact "${c.type}".`;
              toast.error(errMsg);
            } else {
              toast.success(`Contact "${c.type}" updated successfully ✅`);
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error("❌ Unexpected Error:", err);
          toast.error(
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong ❌"
          );
        } finally {
          setLoading(false);
          setSubmitting(false);
        }
      }}

    >
      {({ values, isValid, dirty, errors, touched }) => {
        // Log real-time form states
        // console.log("📝 Form Values:", values);
        // console.log("❗ Validation Errors:", errors);
        // console.log("👆 Touched Fields:", touched);

        return (
          <Form>
            <FieldArray name="contacts">
              {({ push, remove }) => (
                <div className="border rounded shadow-sm mb-6 border-[#808080] relative">
                  <div className="p-4">
                    <h3 className="text-xl text-black font-semibold mb-2">
                      Contact Us
                    </h3>

                    {values.contacts.map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-4"
                      >
                        {/* Type Field */}
                        <div className="flex-1">
                          <Field
                            as="select"
                            name={`contacts[${index}].type`}
                            className="border cursor-pointer  border-black text-black px-2 py-1 rounded w-full"
                          >
                            <option value="">Select Type</option>
                            <option value="Email">Email</option>
                            <option value="Phone">Phone</option>
                            <option value="Address">Address</option>
                            <option value="Other">Other</option>
                          </Field>
                          <ErrorMessage
                            name={`contacts[${index}].type`}
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>

                        {/* Value Field */}
                        <div className="flex-1">
                          <Field
                            name={`contacts[${index}].value`}
                            placeholder="Enter Value"
                            className="border border-black text-black px-2 py-1 rounded w-full"
                          />
                          <ErrorMessage
                            name={`contacts[${index}].value`}
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>

                        {/* Position Field */}
                        <div className="flex-1">
                          <Field
                            name={`contacts[${index}].position`}
                            placeholder="Position"
                            className="border border-black text-black px-2 py-1 rounded w-full"
                          />
                          <ErrorMessage
                            name={`contacts[${index}].position`}
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-2 cursor-pointer  sm:mt-0"
                        >
                          <LucideTrash2 className="text-[#ff0000]" />
                        </button>
                      </div>
                    ))}

                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                      <button
                        type="button"
                        className="bg-amber-600 text-white px-3 py-2 rounded-md cursor-pointer"
                        onClick={() =>
                          push({ type: "", value: "", position: "" })
                        }
                      >
                        + Add Contact
                      </button>

                      <button
                        type="submit"
                        disabled={!isValid || !dirty || loading}
                        className={`flex items-center cursor-pointer  justify-center gap-2 px-4 py-2 rounded-md text-white ${loading
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-[#243c50] hover:bg-[#1e2f3d] cursor-pointer"
                          }`}
                      >
                        {loading && (
                          <Loader2 className="animate-spin h-4 w-4 text-white" />
                        )}
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </FieldArray>
          </Form>
        );
      }}
    </Formik>
  );
}

function Settings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state: any) => state?.user);
  const router = useRouter();

  const activity = [
    // {
    //   id: 5,
    //   label: "Blogs",
    //   description: "Manage Your Blog post here",
    //   goTo: "/admin/blogs"
    // },
    // {
    //   id: 6,
    //   label: "Testimonials",
    //   description: "Manage Your Testimonials here",
    //   goTo: "/admin/testimonials"
    // },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#16325d]">Settings</h2>

      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activity.map((item): any => (
          <div onClick={() => router.push(item.goTo)} key={item?.id} className="p-4 border  hover:cursor-pointer hover:bg-[#e0dcf0] rounded shadow-sm mb-6 border-[#808080]">
            <h3 className="text-xl text-black font-semibold mb-2">{item?.label}</h3>
            <p className='text-[#16325d]'>{item?.description}</p>
          </div>
        ))
      }
      <CommunicationMailManagement />
      <SocialMediaManagement />
      <ContactUsManagement />
    </div>
  );
}

export default Settings;
