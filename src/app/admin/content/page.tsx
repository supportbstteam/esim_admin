import React from 'react'
import ContentCMS from './ContentCMS'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "CMS",
};

const page = () => {
  return (
    <ContentCMS/>
  )
}

export default page