"use client";
import PageHeader from '@/components/common/PageHeader';
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

    console.log("----- testimonials -----", faqs);

    return (
        <div>
            <PageHeader
                title="FAQs"
                addButtonText="+ Add FAQ"
                showBackButton={false}
                addButtonRoute="/admin/faqs/manage?mode=create"
            />
            <FaqTable />
        </div>
    )
}

export default Faqs