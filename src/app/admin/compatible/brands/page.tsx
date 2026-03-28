import React from 'react'
import { Metadata } from 'next';
import BrandPage from './BrandPage';


export const metadata: Metadata = {
  title: "Compatiblity",
};

const page = () => {
  return (
    <BrandPage/>
  )
}

export default page