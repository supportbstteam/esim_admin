"use client";

import React from "react";
import { Formik, Form, FieldArray, useField, useFormikContext, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useAppSelector } from "@/store";

interface OperatorEntry {
    name: string;
    countries: string[]; // country IDs
    code: string;
    isActive: boolean;
}

interface OperatorModalProps {
    open: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmit: (values: { operators: OperatorEntry[] }, formikHelpers: any) => void;
}
interface AddOperatorModalProps {
    open: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmit: (values: any, formikHelpers: any) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operator?: any; // 👈 pass selected operator for editing
}


// ✅ Validation schema
const operatorSchema = Yup.object({
    operators: Yup.array()
        .of(
            Yup.object({
                name: Yup.string().required("Operator Name is required"),
                countries: Yup.array().min(1, "Select at least one country"),
                code: Yup.string().required("Code is required"),
                isActive: Yup.boolean(),
            })
        )
        .min(1, "At least one operator must be added"),
});

// ✅ Custom MultiSelect with react-select
const CustomMultiSelect: React.FC<{
    name: string;
    options: { value: string; label: string }[];
}> = ({ name, options }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (selected: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const values = selected ? selected.map((opt: any) => opt.value) : [];
        setFieldValue(name, values);
    };

    const selectedValues = options.filter((opt) => field.value.includes(opt.value));

    return (
        <div>
            <Select
                isMulti
                options={options}
                value={selectedValues}
                onChange={handleChange}
                onBlur={field.onBlur}
                classNamePrefix="react-select"
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        backgroundColor: "#fff", // dark gray
                        borderColor: state.isFocused ? "#3b82f6" : "#374151", // blue on focus
                        boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                        "&:hover": { borderColor: "#3b82f6" },
                        color: "#f9fafb", // light text
                        borderRadius: "0.5rem",
                        padding: "2px 4px",
                    }),
                    multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: "#2563eb", // blue tag
                        borderRadius: "0.25rem",
                    }),
                    multiValueLabel: (provided) => ({
                        ...provided,
                        color: "#f9fafb", // white text on tag
                    }),
                    multiValueRemove: (provided) => ({
                        ...provided,
                        color: "#f9fafb",
                        ":hover": { backgroundColor: "#1e40af", color: "white" }, // darker blue
                    }),
                    menu: (provided) => ({
                        ...provided,
                        backgroundColor: "#111827", // dropdown background (very dark)
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                            ? "#2563eb" // selected = blue
                            : state.isFocused
                                ? "#1e40af" // hover = darker blue
                                : "#111827", // default = dark
                        color: "#f9fafb", // white text
                        cursor: "pointer",
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        color: "#f9fafb", // text inside input
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        color: "#9ca3af", // gray placeholder
                    }),
                }}
            />
            {meta.touched && meta.error ? (
                <div className="text-red-500 text-sm mt-1">{meta.error}</div>
            ) : null}
        </div>
    );
};

export default function OperatorModal({ open, onClose, handleSubmit, operator}: OperatorModalProps & { operator?: OperatorEntry }) {

    const { countries } = useAppSelector((state) => state.countries);

    if (!open) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countryOptions = countries.map((c: any) => ({
        value: c.id,
        label: `${c.name} (${c.isoCode})`,
    }));

    // console.log("---- useselctor countries ---", countries);
    // console.log("---- countriesOptions ---", countryOptions);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050] backdrop-blur-sm">
            <div className="bg-white  rounded-2xl shadow-2xl w-full max-w-4xl p-10 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-3 sticky top-0 bg-white  z-10 py-2">
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-wide">
                        {operator ? "Edit Operator" : "Add Operators"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-3xl text-gray-400 hover:text-red-500  focus:outline-none"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <Formik
                    initialValues={{
                        operators: operator ? [operator] : [
                            {
                                name: "",
                                countries: [],
                                code: "",
                                isActive: true,
                            },
                        ],
                    }}
                    validationSchema={operatorSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values, isSubmitting }) => (
                        <Form>
                            <FieldArray name="operators">
                                {({ remove, push }) => (
                                    <>
                                        {values.operators.map((_, index) => (
                                            <div
                                                key={index}
                                                className="mb-8 border border-gray-300  rounded-lg p-6 relative"
                                            >
                                                {values.operators.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xl"
                                                        aria-label={`Remove operator #${index + 1}`}
                                                    >
                                                        &times;
                                                    </button>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Operator Name */}
                                                    <div>
                                                        <label
                                                            htmlFor={`operators.${index}.name`}
                                                            className="block font-semibold text-gray-700 mb-1"
                                                        >
                                                            Operator Name
                                                        </label>
                                                        <Field
                                                            id={`operators.${index}.name`}
                                                            name={`operators.${index}.name`}
                                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900   focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <ErrorMessage
                                                            name={`operators.${index}.name`}
                                                            component="div"
                                                            className="text-red-500 text-sm mt-1"
                                                        />
                                                    </div>

                                                    {/* Countries */}
                                                    <div>
                                                        <label
                                                            htmlFor={`operators.${index}.countries`}
                                                            className="block font-semibold text-gray-700 mb-1"
                                                        >
                                                            Countries
                                                        </label>
                                                        <CustomMultiSelect
                                                            name={`operators.${index}.countries`}
                                                            options={countryOptions}
                                                        />
                                                    </div>

                                                    {/* Code */}
                                                    <div>
                                                        <label
                                                            htmlFor={`operators.${index}.code`}
                                                            className="block font-semibold text-gray-700 mb-1"
                                                        >
                                                            Code
                                                        </label>
                                                        <Field
                                                            id={`operators.${index}.code`}
                                                            name={`operators.${index}.code`}
                                                            className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900   focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        />
                                                        <ErrorMessage
                                                            name={`operators.${index}.code`}
                                                            component="div"
                                                            className="text-red-500 text-sm mt-1"
                                                        />
                                                    </div>

                                                    {/* Active checkbox */}
                                                    <div className="flex items-center gap-2">
                                                        <Field
                                                            type="checkbox"
                                                            id={`operators.${index}.isActive`}
                                                            name={`operators.${index}.isActive`}
                                                            className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
                                                        />
                                                        <label
                                                            htmlFor={`operators.${index}.isActive`}
                                                            className="text-gray-700 select-none"
                                                        >
                                                            Active
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Operator Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                push({
                                                    name: "",
                                                    countries: [],
                                                    code: "",
                                                    isActive: true,
                                                })
                                            }
                                            className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition shadow"
                                        >
                                            + Add Another Operator
                                        </button>
                                    </>
                                )}
                            </FieldArray>

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-lg font-semibold bg-gray-200  text-gray-700 hover:bg-gray-300  transition"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
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
