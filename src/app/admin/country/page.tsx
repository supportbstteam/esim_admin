import React from 'react'
import { Metadata } from 'next';
import CountryPage from "./CountryPage"

export const metadata: Metadata = {
  title: "Country",
};

const page = () => {
  return (
    <CountryPage/>
  )
}

export default page