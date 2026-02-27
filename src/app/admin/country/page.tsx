"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries, deleteCountry } from '@/store/slice/countrySlice';
import Loader from '@/components/loader';
import CountryTable from '@/components/tables/CountryTable';
import AddCountryModal from '@/components/modals/AddCountryModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import CommonTableSkeleton from '@/components/skeletons/CommonTableSkeleton';

function Country() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: any = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { countries, loading } = useSelector((state: any) => state?.countries);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [countryToDelete, setCountryToDelete] = useState<any>(null);

  // State for edit modal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editCountry, setEditCountry] = useState<any>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      await dispatch(fetchCountries());
    }
    fetchCountry();
  }, [dispatch]);

  const handleDelete = async () => {

    if (!countryToDelete?.id) {
      toast.error("Invalid country id");
      return;
    }

    // console.log("---- countryToDelete ----", countryToDelete);

    const response = await dispatch(deleteCountry(countryToDelete?.id));

    // console.log("---- response ----", response);

    if (response?.type === 'countries/delete/fulfilled') {
      setDeleteModalOpen(false);
      setCountryToDelete(null);
      toast.success(`${countryToDelete.name} deleted successfully`);
    }
    else {
      toast.error("Failed to delete country");

    }

    // dispatch(deleteCountry(countryToDelete.id))
    //   .unwrap()
    //   .then(() => {
    //   })
    //   .catch(() => {
    //   });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (country: any) => {
    return router.push(`/admin/country/${country?.id}`);
  };

  if (loading) return <CommonTableSkeleton />

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <PageHeader
        title="Countries"
        showAddButton={false}
        showBackButton={false}
      />

      {/* Countries Table */}
      <CountryTable
        countries={countries}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // onDelete={(country: any) => {
        //   setCountryToDelete(country);
        //   setDeleteModalOpen(true);
        // }}
        onEdit={handleEdit}
      />

      {/* Add/Edit Country Modal */}
      <AddCountryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditCountry(null);
        }}
        onSuccess={() => {
          setIsAddModalOpen(false);
          setEditCountry(null);
          dispatch(fetchCountries());
        }}
        country={editCountry} // Pass country for editing, undefined for add
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCountryToDelete(null);
        }}
        onConfirm={handleDelete}
        operatorName={countryToDelete?.name || ""}
      />
    </div>
  );
}

export default Country;
