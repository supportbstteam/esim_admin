import React from 'react'
import SettingPage from './SettingPage'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Settings",
};

const page = () => {
  return (
    <SettingPage/>
  )
}

export default page