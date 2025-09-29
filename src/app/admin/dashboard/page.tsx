"use client";
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchPlansDb } from '@/store/slice/apiPlanDbSlice';
import { fetchTopupPlans } from '@/store/slice/apiTopupDbSlice';
import { fetchThirdPartyPlans } from '@/store/slice/ThirdPartyPlanAPi';
import React, { useEffect } from 'react'

function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state?.user);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchThirdPartyPlans());
      await dispatch(fetchTopupPlans());
      await dispatch(fetchPlansDb());
    }

    fetchData();
  }, [user?.id]);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard