import React from 'react'
import EsimPage from './EsimPage'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Orders",
};

const page = () => {
  return (
    <EsimPage/>
  )
}

export default page