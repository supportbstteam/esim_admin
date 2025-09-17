"use client";
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createCountry } from '@/store/slice/countrySlice';
import toast from 'react-hot-toast';

interface AddCountryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface CountryFormValues {
    name: string;
    isoCode: string;
    iso3Code: string;
    currency: string;
    phoneCode: string;
    isActive: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Country name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    isoCode: Yup.string()
        .required('ISO code is required')
        .length(2, 'ISO code must be exactly 2 characters')
        .matches(/^[A-Z]{2}$/, 'ISO code must be 2 uppercase letters'),
    iso3Code: Yup.string()
        .required('ISO3 code is required')
        .length(3, 'ISO3 code must be exactly 3 characters')
        .matches(/^[A-Z]{3}$/, 'ISO3 code must be 3 uppercase letters'),
    currency: Yup.string()
        .required('Currency is required')
        .length(3, 'Currency must be exactly 3 characters')
        .matches(/^[A-Z]{3}$/, 'Currency must be 3 uppercase letters'),
    phoneCode: Yup.string()
        .required('Phone code is required')
        .matches(/^\+\d{1,4}$/, 'Phone code must start with + followed by 1-4 digits'),
    isActive: Yup.boolean().required(),
});

const initialValues: CountryFormValues = {
    name: '',
    isoCode: '',
    iso3Code: '',
    currency: '',
    phoneCode: '',
    isActive: true,
};

const AddCountryModal: React.FC<AddCountryModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dispatch: any = useDispatch();

    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsVisible(true), 50);
        } else if (shouldRender) {
            setIsVisible(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, shouldRender]);

    if (!shouldRender) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: CountryFormValues, { setSubmitting, resetForm }: any) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await dispatch(createCountry(values));
            if (response?.type === 'countries/create/fulfilled') {
                toast.success("Country Added Successfully");
                resetForm();
                onSuccess();
            }
        } catch (error) {
            console.error('Error adding country:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-md transition-colors">
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-[#0000001A] transition-opacity backdrop-blur-md  duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Modal */}
            <div
                className={`
          relative transform overflow-hidden rounded-lg bg-[#1a1a1a] shadow-xl transition-transform duration-300 w-full max-w-lg
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#16325d] to-[#37c74f] px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">Add Country</h3>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 py-4">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                {/* Country Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Country Name
                                    </label>
                                    <Field
                                        name="name"
                                        type="text"
                                        placeholder="Enter country name (e.g., United States)"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f] focus:border-transparent"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
                                </div>

                                {/* ISO Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        ISO Code (2 characters)
                                    </label>
                                    <Field
                                        name="isoCode"
                                        type="text"
                                        placeholder="Enter ISO code (e.g., US)"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f] focus:border-transparent uppercase"
                                        maxLength={2}
                                    />
                                    <ErrorMessage name="isoCode" component="div" className="text-red-400 text-sm mt-1" />
                                </div>

                                {/* ISO3 Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        ISO3 Code (3 characters)
                                    </label>
                                    <Field
                                        name="iso3Code"
                                        type="text"
                                        placeholder="Enter ISO3 code (e.g., USA)"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f] focus:border-transparent uppercase"
                                        maxLength={3}
                                    />
                                    <ErrorMessage name="iso3Code" component="div" className="text-red-400 text-sm mt-1" />
                                </div>

                                {/* Currency */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Currency Code
                                    </label>
                                    <Field
                                        name="currency"
                                        type="text"
                                        placeholder="Enter currency code (e.g., USD)"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f] focus:border-transparent uppercase"
                                        maxLength={3}
                                    />
                                    <ErrorMessage name="currency" component="div" className="text-red-400 text-sm mt-1" />
                                </div>

                                {/* Phone Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Phone Code
                                    </label>
                                    <Field
                                        name="phoneCode"
                                        type="text"
                                        placeholder="Enter phone code (e.g., +1)"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c74f] focus:border-transparent"
                                    />
                                    <ErrorMessage name="phoneCode" component="div" className="text-red-400 text-sm mt-1" />
                                </div>

                                {/* Is Active */}
                                <div className="flex items-center">
                                    <Field
                                        name="isActive"
                                        type="checkbox"
                                        className="w-4 h-4 text-[#37c74f] bg-gray-700 border-gray-600 rounded focus:ring-[#37c74f] focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-300">
                                        Active Status
                                    </label>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#16325d] to-[#37c74f] hover:from-[#37c74f] hover:to-[#16325d] rounded-md transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSubmitting && (
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        )}
                                        {isSubmitting ? 'Adding...' : 'Add Country'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default AddCountryModal;
