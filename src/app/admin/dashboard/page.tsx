import React from 'react'
import Dashboard from './Dashboard'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Dashboard",
};

const page = () => {
  return (
    <Dashboard/>
  )
}

export default page