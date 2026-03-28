import React from 'react'
import TopupOrder from './TopupOrder'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Orders",
};

const page = () => {
  return (
    <TopupOrder/>
  )
}

export default page