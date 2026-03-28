import React from 'react'
import AdminImagePage from './AdminImagePage'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Media",
};

const page = () => {
  return (
    <AdminImagePage/>
  )
}

export default page