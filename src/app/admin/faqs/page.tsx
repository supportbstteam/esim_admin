"use client";
import FaqTable from '@/components/tables/FaqsTable';
import TestimonialsTable from '@/components/tables/TestimonialsTable';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAllFaqs } from '@/store/slice/faqSlice';
import { getAllTestimonials } from '@/store/slice/testimonialsSlice';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Faqs() {

    const faqs = useAppSelector(state => state?.faqs);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const fetchTest = async () => {
        await dispatch(getAllFaqs());
    }
    useEffect(() => {
        fetchTest();
    }, [dispatch]);

    console.log("----- testimonials -----",faqs);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#16325d]">FAQs</h2>
                <button
                    className="rounded cursor-pointer px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none"
                    onClick={() => router.push("/admin/faqs/manage?mode=create")}
                >
                    + Add FAQ
                </button>
            </div>
            <FaqTable/>
        </div>
    )
}

export default Faqs