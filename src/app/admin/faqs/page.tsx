import React from 'react'
import FaqPage from './FaqPage'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Faqs",
};

const page = () => {
  return (
    <FaqPage/>
  )
}

export default page