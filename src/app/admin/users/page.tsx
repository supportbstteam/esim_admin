"use client";
import CustomerAddModal from '@/components/modals/CustomerAddModal';
import CustomerTable from '@/components/tables/CustomerTable';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  blockAdminUser,
  deleteAdminUser,
  getAllAdminUsers,
} from '@/store/slice/adminUserSlice';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Users() {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { customer } = useAppSelector((state: any) => state?.customer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useAppSelector((state: any) => state?.user);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    await dispatch(getAllAdminUsers());
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleDeleteCustomer = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(deleteAdminUser(id));
      if (response?.type === 'adminUser/delete/fullfilled') {
        toast.success('User deleted successfully');
        fetchData();
      } else {
        toast.error('Something went wrong! Please try later');
        fetchData();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error deleting the user:', err);
    }
  };

  const handleBlockCustomer = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(blockAdminUser(id));
      if (response?.type === 'adminUser/block/fullfilled') {
        toast.success('User blocked successfully');
        fetchData();
      } else {
        toast.error('Something went wrong! Please try later');
        fetchData();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error blocking the user:', err);
    }
  };

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#16325d]">Customer</h2>
        <button
          className="rounded px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none"
          onClick={() => setShowModal(true)}
        >
          + Add Customer
        </button>
      </div>
      <CustomerTable
        customers={customer}
        onToggleBlock={handleBlockCustomer}
        onToggleDelete={handleDeleteCustomer}
      />
      <CustomerAddModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default Users;
