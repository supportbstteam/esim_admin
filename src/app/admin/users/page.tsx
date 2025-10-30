"use client";
import CustomerAddModal from '@/components/modals/CustomerAddModal';
import CustomerDeleteModal from '@/components/modals/CustomerDeleteModal';
import CustomerTable from '@/components/tables/CustomerTable';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  blockAdminUser,
  deleteAdminUser,
  getAllAdminUsers,
} from '@/store/slice/adminUserSlice';
import { fetchCountries } from '@/store/slice/countrySlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

function Users() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { customer } = useAppSelector((state: any) => state?.customer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { countries } = useAppSelector((state: any) => state?.countries);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useAppSelector((state: any) => state?.user);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);

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
      if (response?.type === 'adminUser/delete/fulfilled') {
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

      console.log("--- response in the user blocking ---", response);
      if (response?.type === 'adminUser/block/fulfilled') {
        // toast.success('User Blocked Status Changed Sucessfully');
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

  const filteredCustomers = useMemo(() => {
    const sorted = [...customer].sort(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (!searchTerm) return sorted;

    return sorted.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) =>
        c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, customer]);


  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteModal(true);
  };

  // console.log("----- filter -----",filteredCustomers);

  // console.log("--- find by id filter ---", filteredCustomers.find((u: any) => u.id === deleteId)?.firstName);

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#16325d]">Customers</h2>
        <button
          className="rounded px-5 py-2 text-white bg-[#37c74f] hover:bg-[#28a23a] focus:outline-none"
          onClick={() => router.push("/admin/users/manage?mode=create")}
        >
          + Add Customer
        </button>
      </div>

      <CustomerTable
        customers={filteredCustomers}
        onToggleBlock={handleBlockCustomer}
        onToggleDelete={handleDeleteClick}
      />

      <CustomerAddModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <CustomerDeleteModal
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isDeleted={filteredCustomers && filteredCustomers.find((u: any) => u.id === deleteId)?.isDeleted}
        isOpen={isDeleteModal}      // pass open instead of isOpen
        onClose={() => setIsDeleteModal(false)}
        onConfirm={() => {
          if (deleteId) handleDeleteCustomer(deleteId);
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        username={filteredCustomers && filteredCustomers.find((u: any) => u.id === deleteId)?.firstName}
      />

    </div>
  );
}

export default Users;
