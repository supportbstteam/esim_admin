import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "@/store";

const eSimSchema = Yup.object({
    eSims: Yup.array()
        .of(
            Yup.object({
                simNumber: Yup.string().required("SIM Number is required"),
                countryId: Yup.string().required("Country selection is required"),
                company: Yup.string().required("Company is required"),
                isActive: Yup.boolean(),
            })
        )
        .min(1, "At least one eSIM must be added"),
});

interface ESIMEntry {
    simNumber: string;
    countryId: string;
    company: string;
    isActive: boolean;
}

interface ESimModalProps {
    open: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmit: (values: any, formikHelpers: any) => void;
}

export default function ESimModal({ open, onClose, handleSubmit }: ESimModalProps) {
    const { countries } = useAppSelector(state => state.countries);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000000] backdrop-blur-md transition-colors">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-10 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-3 sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-wide">
                        Add eSIMs
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-3xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <Formik
                    initialValues={{
                        eSims: [
                            {
                                simNumber: "",
                                countryId: "",
                                company: "",
                                isActive: false,
                            },
                        ],
                    }}
                    validationSchema={eSimSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, isSubmitting }) => (
                        <Form>
                            <FieldArray name="eSims">
                                {({ remove, push }) => (
                                    <>
                                        {values.eSims.map((_: ESIMEntry, index: number) => (
                                            <div
                                                key={index}
                                                className="mb-8 border border-gray-300 dark:border-gray-700 rounded-lg p-6 relative"
                                            >
                                                {values.eSims.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xl"
                                                        aria-label={`Remove eSIM #${index + 1}`}
                                                    >
                                                        &times;
                                                    </button>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`eSims.${index}.simNumber`}>
                                                            SIM Number
                                                        </label>
                                                        <Field
                                                            id={`eSims.${index}.simNumber`}
                                                            name={`eSims.${index}.simNumber`}
                                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <ErrorMessage
                                                            name={`eSims.${index}.simNumber`}
                                                            component="div"
                                                            className="text-red-500 text-sm mt-1"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`eSims.${index}.countryId`}>
                                                            Country
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id={`eSims.${index}.countryId`}
                                                            name={`eSims.${index}.countryId`}
                                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select a Country</option>
                                                            {countries.map((c: any) => (
                                                                <option key={c._id} value={c._id}>
                                                                    {c.name} ({c.isoCode})
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage
                                                            name={`eSims.${index}.countryId`}
                                                            component="div"
                                                            className="text-red-500 text-sm mt-1"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`eSims.${index}.company`}>
                                                            Company
                                                        </label>
                                                        <Field
                                                            id={`eSims.${index}.company`}
                                                            name={`eSims.${index}.company`}
                                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <ErrorMessage
                                                            name={`eSims.${index}.company`}
                                                            component="div"
                                                            className="text-red-500 text-sm mt-1"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Field
                                                            type="checkbox"
                                                            id={`eSims.${index}.isActive`}
                                                            name={`eSims.${index}.isActive`}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded transition"
                                                        />
                                                        <label
                                                            htmlFor={`eSims.${index}.isActive`}
                                                            className="text-gray-700 dark:text-gray-200 select-none"
                                                        >
                                                            Active
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                push({
                                                    simNumber: "",
                                                    countryId: "",
                                                    company: "",
                                                    isActive: false,
                                                })
                                            }
                                            className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition shadow"
                                        >
                                            + Add Another eSIM
                                        </button>
                                    </>
                                )}
                            </FieldArray>

                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 hover:dark:bg-gray-600 transition"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                                    disabled={isSubmitting}
                                >
                                    Save All
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
