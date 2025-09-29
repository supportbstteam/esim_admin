"use client";
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPlansDb } from '@/store/slice/apiPlanDbSlice';
import { fetchTopupPlans } from '@/store/slice/apiTopupDbSlice';
import { fetchCountries } from '@/store/slice/countrySlice';
import { fetchThirdPartyPlans } from '@/store/slice/ThirdPartyPlanAPi';
import styled from 'styled-components';
import CardStat from '@/components/Cards/CardStats';
import { MdAttachMoney, MdPublic, MdSignalCellularAlt } from 'react-icons/md';

const CardGrid = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  padding: 1.5rem 0;
`;

function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state?.user);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchThirdPartyPlans());
      await dispatch(fetchTopupPlans());
      await dispatch(fetchPlansDb());
      await dispatch(fetchCountries());
    };
    fetchData();
  }, [user?.id]);

  const { countries } = useAppSelector((state) => state?.countries);
  const { plans } = useAppSelector((state) => state.plan);
  const { items } = useAppSelector((state) => state.topup);

  return (
    <CardGrid>
      <CardStat title="Countries" value={countries?.length ?? 0} icon={<MdPublic />} />
      <CardStat title="Plans" value={plans?.length ?? 0} icon={<MdAttachMoney />} />
      <CardStat title="Topups" value={items?.length ?? 0} icon={<MdSignalCellularAlt />} />

    </CardGrid>
  );
}

export default Dashboard;
