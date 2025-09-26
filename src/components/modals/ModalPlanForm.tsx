import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, FieldArray, FieldProps } from "formik";
import { useAppSelector } from "@/store";
import { FiTrash2, FiChevronDown } from "react-icons/fi";

type ApiPlanType = {
  id: number;
  title: string;
  name: string;
  data: number;
  call: number;
  sms: number;
  is_unlimited: boolean;
  validity_days: number;
  price: string;
  currency: string;
  country_id: number;
  country: { id: number; code: string; name: string; iso3: string };
};

type SelectedPlanEntry = {
  countryId: string;
  planId: number;
  planData?: ApiPlanType;
};

interface ModalPlanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SelectedPlanEntry[]) => void;
}

// Icon to represent a plan
const PlanIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.785.57-1.84-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.97z" />
  </svg>
);

// Custom dropdown for plan selection with icon & details
const PlanDropdown: React.FC<FieldProps & {
  plans: ApiPlanType[];
  disabled: boolean;
}> = ({ field, form, plans, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPlan = plans.find(plan => plan.id === field.value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-50 dark:hover:bg-green-900"
        }`}
        onClick={() => !disabled && setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        {selectedPlan ? (
          <div className="flex items-center gap-2">
            <PlanIcon />
            <span>{selectedPlan.title}</span>
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">-- Select Plan --</span>
        )}
        <FiChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {plans.length === 0 && (
            <li className="cursor-default select-none py-2 px-4 text-gray-500 dark:text-gray-400">
              No plans available
            </li>
          )}
          {plans.map(plan => (
            <li
              key={plan.id}
              role="option"
              aria-selected={field.value === plan.id}
              className={`cursor-pointer select-none py-2 px-4 flex items-center gap-3 rounded-md transition-colors duration-150
                ${
                  field.value === plan.id
                    ? "bg-green-100 dark:bg-green-700 font-semibold text-gray-900 dark:text-gray-100"
                    : "text-gray-900 dark:text-gray-100 hover:bg-green-200 dark:hover:bg-green-800"
                }
              `}
              onClick={() => {
                form.setFieldValue(field.name, plan.id);
                form.setFieldValue(field.name.replace("planId", "planData"), plan);
                setOpen(false);
              }}
            >
              <PlanIcon />
              <div>
                <div className="font-bold text-sm">{plan.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">${plan.price} | Validity: {plan.validity_days} days</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ModalPlanForm: React.FC<ModalPlanFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { apiPlans } = useAppSelector((state: any) => state.thirdParty);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { countries } = useAppSelector((state: any) => state.countries);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 bg-inherit z-10 pb-3 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            Add Plan
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <Formik
          initialValues={{
            entries: [{ countryId: "", planId: 0, planData: undefined }],
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            onSubmit(values.entries);
            setSubmitting(false);
            resetForm();
            onClose();
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <FieldArray name="entries">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-12">
                    {values.entries.map((entry, idx) => {
                      const selectedCountry = countries.find(
                        (c) => c.id === entry.countryId
                      );

                      // Filter plans by the selected country's name
                      const plans = selectedCountry
                        ? apiPlans?.data?.filter(
                            (p: ApiPlanType) => p.country.name === selectedCountry.name
                          ) || []
                        : [];

                      // Auto-set selected plan data to keep sync
                      const selectedPlan =
                        plans.find((p) => p.id === entry.planId) || undefined;
                      if (selectedPlan && entry.planData !== selectedPlan) {
                        setFieldValue(`entries[${idx}].planData`, selectedPlan);
                      }

                      return (
                        <div
                          key={idx}
                          className="relative p-4 rounded-xl border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 shadow mb-6"
                        >
                          {/* Remove Button */}
                          {values.entries.length > 1 && (
                            <button
                              type="button"
                              className="absolute top-4 right-4 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full p-1 transition-colors"
                              onClick={() => remove(idx)}
                              aria-label="Remove plan"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          )}

                          {/* Country Dropdown */}
                          <div className="mb-4">
                            <label className="block font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              Country
                            </label>
                            <Field
                              as="select"
                              name={`entries[${idx}].countryId`}
                              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setFieldValue(`entries[${idx}].countryId`, e.target.value);
                                setFieldValue(`entries[${idx}].planId`, 0);
                                setFieldValue(`entries[${idx}].planData`, undefined);
                              }}
                            >
                              <option value="" className="dark:text-gray-700">-- Select Country --</option>
                              {countries.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </Field>
                          </div>

                          {/* Enhanced Plan Dropdown */}
                          <div className="mb-4">
                            <label className="block font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              Plan
                            </label>
                            <Field name={`entries[${idx}].planId`}>
                              {(fieldProps: FieldProps) => (
                                <PlanDropdown
                                  {...fieldProps}
                                  plans={plans}
                                  disabled={!entry.countryId}
                                />
                              )}
                            </Field>
                          </div>

                          {/* Auto-filled Plan Data — Display only, disabled inputs */}
                          {entry.planData && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-gray-900 dark:text-gray-100">Title</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  value={entry.planData.title}
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-gray-900 dark:text-gray-100">Name</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  value={entry.planData.name}
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-gray-900 dark:text-gray-100">Data (GB)</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  value={entry.planData.data}
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-gray-900 dark:text-gray-100">Call Units</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  value={entry.planData.call}
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-gray-900 dark:text-gray-100">SMS Units</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  value={entry.planData.sms}
                                  disabled
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="block text-gray-900 dark:text-gray-100">Unlimited</label>
                                <input
                                  type="checkbox"
                                  checked={entry.planData.is_unlimited}
                                  disabled
                                  className="h-4 w-4"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-900 dark:text-gray-100">Validity Days</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  value={entry.planData.validity_days}
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-gray-900 dark:text-gray-100">Price</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  value={entry.planData.price}
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-gray-900 dark:text-gray-100">Currency</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  value={entry.planData.currency}
                                  disabled
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add New Plan Button */}
                    <button
                      type="button"
                      className="px-6 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white transition flex items-center gap-2"
                      onClick={() => push({ countryId: "", planId: 0, planData: undefined })}
                    >
                      + Add Another Plan
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 font-bold rounded-lg bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800 transition flex items-center gap-2"
                >
                  {isSubmitting ? "Adding..." : "Add Plan(s)"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
