"use client";
import TestimonialsTable from '@/components/tables/TestimonialsTable';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAllTestimonials } from '@/store/slice/testimonialsSlice';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Testimonial() {

    const {testimonials} = useAppSelector(state => state?.testimonials);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const fetchTest = async () => {
        await dispatch(getAllTestimonials());
    }
    useEffect(() => {
        fetchTest();
    }, [dispatch]);

    console.log("----- testimonials -----",testimonials);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#16325d]">Testimonials</h2>
                <button
                    className="rounded cursor-pointer px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none"
                    onClick={() => router.push("/admin/testimonials/manage?mode=create")}
                >
                    + Add Customer
                </button>
            </div>
            <TestimonialsTable/>
        </div>
    )
}

export default Testimonial