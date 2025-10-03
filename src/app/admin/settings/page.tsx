"use client";

import { useAppDispatch, useAppSelector } from '@/store';
import { LucideTrash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createSocials, getSocials, updateSocial } from '@/store/slice/socialSlice';
import { createContacts, getContacts, updateContact } from '@/store/slice/contactSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
// Profile component remains unchanged

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
                        className="text-red-600 font-bold px-2 py-1 hover:bg-red-100 rounded"
                      >
                        <LucideTrash2 />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="bg-amber-600 p-2 rounded-md"
                    onClick={() => push({ type: "", link: "" })}
                  >
                    + Add Social
                  </button>
                  <button
                    type="submit"
                    className="bg-[#243c50] p-2 rounded-md absolute right-2 bottom-2"
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
        type: Yup.string().required('Contact type is required'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: Yup.string().when(['type'], (type: any, schema: Yup.StringSchema) => {
          if ((type).toString()?.toLowerCase() === 'email') {
            return schema.email('Invalid email address').required('Email is required');
          } else {
            return schema
              .matches(/^\+?[0-9\s-]{7,15}$/, 'Invalid phone number')
              .required('Phone number is required');
          }
        }),
        position: Yup.string(),
      })
    )
    .min(1, 'At least one contact information is required'),
});



function ContactUsManagement() {
  const dispatch = useAppDispatch();
  const { items: contacts } = useAppSelector((state) => state.contacts);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getSocials());
      await dispatch(getContacts());
    }
    fetchData();
  }, [user?.id])

  return (
    <Formik
      initialValues={{ contacts: contacts.length ? contacts : [{ type: "Phone", value: "", position: "" }] }}
      validationSchema={contactSchema}
      enableReinitialize
      onSubmit={async (values) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createList = values.contacts.filter((c: any) => !c.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateList: any = values.contacts.filter((c: any) => c.id);

        try {
          if (createList.length) {
            await dispatch(createContacts(createList));
            toast.success(`${createList.length} contact(s) created successfully ✅`);
          }
          for (const c of updateList) {
            await dispatch(updateContact({ id: c.id!, ...c }));
            toast.success(`Contact "${c.type}" updated successfully ✅`);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          toast.error(err?.message || "Something went wrong ❌");
        }
      }}
    >
      {({ values, isValid, dirty }) => (
        <Form>
          <FieldArray name="contacts">
            {({ push, remove }) => (
              <div className="border rounded shadow-sm mb-6 border-[#808080] relative">
                <div className="p-4">
                  <h3 className="text-xl text-black font-semibold mb-2">Contact Us</h3>
                  {values.contacts.map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-3">
                      <Field name={`contacts[${index}].type`} placeholder="Type" className="border border-black text-black px-2 py-1 rounded" />
                      <Field name={`contacts[${index}].value`} placeholder="Value" className="border border-black text-black px-2 py-1 rounded" />
                      <Field name={`contacts[${index}].position`} placeholder="Position" className="border border-black text-black px-2 py-1 rounded" />
                      <button type="button" onClick={() => remove(index)}>
                        <LucideTrash2 className='text-[#ff0000]' />
                      </button>
                    </div>
                  ))}
                  <button type="button" className='bg-amber-600 p-2 rounded-md ' onClick={() => push({ type: "", value: "", position: "" })}>+ Add Contact</button>
                  <button type="submit" className='bg-[#243c50] p-2 rounded-md absolute right-2 bottom-2' disabled={!isValid || !dirty}>Submit</button>
                </div>
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
}

function Settings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state: any) => state?.user);
  const router = useRouter();

  const activity = [
    {
      id: 1,
      label: "Profile",
      description: "Edit Profile",
      goTo: "/admin/profile"
    },
    {
      id: 2,
      label: "About Us",
      description: "About us Page",
      goTo: "/admin/about"
    },
    {
      id: 3,
      label: "Privacy Policies",
      description: "Privacy Policies Page",
      goTo: "/admin/privacy"
    },
    {
      id: 4,
      label: "Terms & Conditions",
      description: "Terms & Conditions Page",
      goTo: "/admin/terms"
    },
    {
      id: 5,
      label: "Blogs",
      description: "Manage Your Blog post here",
      goTo: "/admin/blogs"
    },
    {
      id: 6,
      label: "Testimonials",
      description: "Manage Your Testimonials here",
      goTo: "/admin/testimonials"
    },
    {
      id: 7,
      label: "FAQs",
      description: "Manage Your FAQs here",
      goTo: "/admin/faq"
    },
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
      <SocialMediaManagement />
      <ContactUsManagement />
    </div>
  );
}

export default Settings;
