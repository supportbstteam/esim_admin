import React from 'react'
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'

// Replace with real data where needed
const countries = [
  { id: 'in', name: 'India' },
  { id: 'us', name: 'USA' }
]
const operators = [
  { id: 'airtel', name: 'Airtel' },
  { id: 'jio', name: 'Jio' }
]

const PlanSchema = Yup.object().shape({
  plans: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name required'),
      dataLimit: Yup.string().required('Data limit required'),
      validity: Yup.string().required('Validity required'),
      price: Yup.number().typeError('Must be a number').required('Price required'),
      nationalCalls: Yup.boolean().required(),
      internationalCalls: Yup.boolean().required(),
      country: Yup.string().required('Country required'),
      operators: Yup.string().required('Operator required')
    })
  ).min(1, "At least one plan must be added")
})

const initialValues = {
  plans: [
    {
      name: '',
      dataLimit: '',
      validity: '',
      price: '',
      nationalCalls: false,
      internationalCalls: false,
      country: '',
      operators: ''
    }
  ]
}

export function PlansFormModal({ open = true, onClose, onSubmit }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000a] backdrop-blur-md transition-colors">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-10 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-wide">Add Plans</h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={PlanSchema}
          onSubmit={onSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <FieldArray name="plans">
                {({ remove, push }) => (
                  <>
                    {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    values.plans.map((_: any, idx: number) => (
                      <div
                        key={idx}
                        className="mb-8 border border-gray-300 dark:border-gray-700 rounded-lg p-6 relative"
                      >
                        {values.plans.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xl"
                            aria-label={`Remove plan #${idx + 1}`}
                          >
                            &times;
                          </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`plans.${idx}.name`}>
                              Name
                            </label>
                            <Field
                              id={`plans.${idx}.name`}
                              name={`plans.${idx}.name`}
                              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name={`plans.${idx}.name`} component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`plans.${idx}.dataLimit`}>
                              Data Limit
                            </label>
                            <Field
                              id={`plans.${idx}.dataLimit`}
                              name={`plans.${idx}.dataLimit`}
                              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name={`plans.${idx}.dataLimit`} component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`plans.${idx}.validity`}>
                              Validity
                            </label>
                            <Field
                              id={`plans.${idx}.validity`}
                              name={`plans.${idx}.validity`}
                              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name={`plans.${idx}.validity`} component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`plans.${idx}.price`}>
                              Price
                            </label>
                            <Field
                              id={`plans.${idx}.price`}
                              name={`plans.${idx}.price`}
                              type="number"
                              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name={`plans.${idx}.price`} component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Field
                              type="checkbox"
                              id={`plans.${idx}.nationalCalls`}
                              name={`plans.${idx}.nationalCalls`}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded transition"
                            />
                            <label htmlFor={`plans.${idx}.nationalCalls`} className="text-gray-700 dark:text-gray-200 select-none">
                              National Calls
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Field
                              type="checkbox"
                              id={`plans.${idx}.internationalCalls`}
                              name={`plans.${idx}.internationalCalls`}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded transition"
                            />
                            <label htmlFor={`plans.${idx}.internationalCalls`} className="text-gray-700 dark:text-gray-200 select-none">
                              International Calls
                            </label>
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`plans.${idx}.country`}>
                              Country
                            </label>
                            <Field
                              as="select"
                              id={`plans.${idx}.country`}
                              name={`plans.${idx}.country`}
                              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select a Country</option>
                              {countries.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name={`plans.${idx}.country`} component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor={`plans.${idx}.operators`}>
                              Operator
                            </label>
                            <Field
                              as="select"
                              id={`plans.${idx}.operators`}
                              name={`plans.${idx}.operators`}
                              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select an Operator</option>
                              {operators.map((o) => (
                                <option key={o.id} value={o.id}>
                                  {o.name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name={`plans.${idx}.operators`} component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          name: '',
                          dataLimit: '',
                          validity: '',
                          price: '',
                          nationalCalls: false,
                          internationalCalls: false,
                          country: '',
                          operators: ''
                        })
                      }
                      className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition shadow"
                    >
                      + Add Another Plan
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
  )
}
