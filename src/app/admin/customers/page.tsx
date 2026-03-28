import React from 'react'
import CustomerPage from "./CustomerPage"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Customers",
};


const page = () => {
  return (
    <CustomerPage/>
  )
}

export default page