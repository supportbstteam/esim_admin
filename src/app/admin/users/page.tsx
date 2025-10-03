"use client";
import CustomerAddModal from '@/components/modals/CustomerAddModal';
import CustomerTable from '@/components/tables/CustomerTable';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  blockAdminUser,
  deleteAdminUser,
  getAllAdminUsers,
} from '@/store/slice/adminUserSlice';
import { fetchCountries } from '@/store/slice/countrySlice';
import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

function Users() {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { customer } = useAppSelector((state: any) => state?.customer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { countries } = useAppSelector((state: any) => state?.countries);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useAppSelector((state: any) => state?.user);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    await dispatch(getAllAdminUsers());
    await dispatch(fetchCountries());
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

  // Filtered customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customer;
    return customer.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) =>
        c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, customer]);

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#16325d]">Customers</h2>
        <button
          className="rounded px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none"
          onClick={() => setShowModal(true)}
        >
          + Add Customer
        </button>
      </div>

      {/* Search input with React Icon */}
      <div className="mb-4 relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-black border border-gray-300 rounded px-10 py-2 focus:outline-none focus:border-[#32315f]"
        />
      </div>

      <CustomerTable
        customers={filteredCustomers}
        onToggleBlock={handleBlockCustomer}
        onToggleDelete={handleDeleteCustomer}
      />

      <CustomerAddModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default Users;
