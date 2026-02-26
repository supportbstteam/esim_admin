"use client";
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPlansDb } from '@/store/slice/apiPlanDbSlice';
import { fetchTopupPlans } from '@/store/slice/apiTopupDbSlice';
import { fetchCountries } from '@/store/slice/countrySlice';
import { fetchThirdPartyPlans } from '@/store/slice/ThirdPartyPlanAPi';
import styled from 'styled-components';
import CardStat from '@/components/Cards/CardStats';
import { MdAttachMoney, MdPublic, MdSignalCellularAlt, MdPerson } from 'react-icons/md';
import { getAllAdminUsers } from '@/store/slice/adminUserSlice';
import { getSocials } from '@/store/slice/socialSlice';
import { getContacts } from '@/store/slice/contactSlice';

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
      await dispatch(getSocials());
      await dispatch(getContacts());
      await dispatch(getAllAdminUsers());
      await dispatch(fetchTopupPlans());
      await dispatch(fetchPlansDb());
      await dispatch(fetchCountries());
    };
    fetchData();
  }, [user?.id]);

  const { countries } = useAppSelector((state) => state?.countries);
  const { plans } = useAppSelector((state) => state.plan);
  const { items } = useAppSelector((state) => state.topup);
  const { customer } = useAppSelector((state) => state.customer);

  // console.log("--- customer ---", customer);

  return (
    <CardGrid>
      <CardStat title="Countries" route="/admin/country" value={countries?.length ?? 0} icon={<MdPublic />} />
      <CardStat title="Plans" route="/admin/plans" value={plans?.length ?? 0} icon={<MdAttachMoney />} />
      <CardStat title="Topups" route="/admin/topup" value={items?.length ?? 0} icon={<MdSignalCellularAlt />} />
      <CardStat title="Customers" route="/admin/customers" value={customer?.length ?? 0} icon={<MdPerson />} />
    </CardGrid>
  );
}

export default Dashboard;
