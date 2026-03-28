import React from 'react'
import TestimonialPage from './TestimonialPage'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Testimonials",
};

const page = () => {
  return (
    <TestimonialPage/>
  )
}

export default page