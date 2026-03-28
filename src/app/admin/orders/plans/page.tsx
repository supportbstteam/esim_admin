// PlanOrders

import React from 'react'
import PlanOrders from './PlanOrders'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Orders",
};

const page = () => {
  return (
    <PlanOrders/>
  )
}

export default page