import React from 'react'
import { Metadata } from 'next';
import DevicePage from './DevicePage';


export const metadata: Metadata = {
  title: "Compatiblity",
};

const page = () => {
  return (
    <DevicePage/>
  )
}

export default page