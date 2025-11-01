"use client";
import PageHeader from '@/components/common/PageHeader';
import TestimonialsTable from '@/components/tables/TestimonialsTable';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAllTestimonials } from '@/store/slice/testimonialsSlice';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Testimonial() {

    const { testimonials } = useAppSelector(state => state?.testimonials);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const fetchTest = async () => {
        await dispatch(getAllTestimonials());
    }
    useEffect(() => {
        fetchTest();
    }, [dispatch]);

    console.log("----- testimonials -----", testimonials);

    return (
        <div>
            <PageHeader
                title="Testimonials"
                addButtonText="+ Add Testimonial"
                showBackButton={false}
                addButtonRoute="/admin/testimonials/manage?mode=create"
            />
            <TestimonialsTable />
        </div>
    )
}

export default Testimonial