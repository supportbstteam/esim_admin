import React from 'react'
import { Metadata } from 'next';
import ContentList from './CmsPageAdmin';


export const metadata: Metadata = {
  title: "CMS",
};

const page = () => {
  return (
    <ContentList/>
  )
}

export default page