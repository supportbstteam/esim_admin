"use client";
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchOrders } from '@/store/slice/orderSlice';
import React, { useEffect } from 'react'

function TopUpOrder() {
  const dispatch = useAppDispatch();
  const { topUpOrders } = useAppSelector(state => state?.topUpOrders);
  useEffect(() => {
    const fetchTopUpOrders = async () => {
      await dispatch(fetchOrders());
    }

    fetchTopUpOrders();
  }, [dispatch]);

  console.log("------- top up orders ------", topUpOrders);
  return (
    <div>TopUpOrder</div>
  )
}

export default TopUpOrder