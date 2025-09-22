"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries, deleteCountry } from '@/store/slice/countrySlice';
import Loader from '@/components/loader';
import CountryTable from '@/components/tables/CountryTable';
import AddCountryModal from '@/components/modals/AddCountryModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import toast from "react-hot-toast";

function Country() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: any = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { countries, loading } = useSelector((state: any) => state?.countries);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<any>(null);

  // State for edit modal
  const [editCountry, setEditCountry] = useState<any>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      await dispatch(fetchCountries());
    }
    fetchCountry();
  }, [dispatch]);

const handleDelete = () => {
  if (!countryToDelete?._id) {
    toast.error("Invalid country id");
    return;
  }

  dispatch(deleteCountry(countryToDelete._id))
    .unwrap()
    .then(() => {
      toast.success(`${countryToDelete.name} deleted successfully`);
      setDeleteModalOpen(false);
      setCountryToDelete(null);
    })
    .catch(() => {
      toast.error("Failed to delete country");
    });
};


  const handleEdit = (country: any) => {
    setEditCountry(country);
    setIsAddModalOpen(true);
  };

  if (loading) return <Loader />

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#000]">Countries</h1>
        <button
          onClick={() => {
            setEditCountry(null);
            setIsAddModalOpen(true);
          }}
           className="flex items-center gap-2 px-6 py-3 font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Country
        </button>
      </div>

      {/* Countries Table */}
      <CountryTable
        countries={countries}
        onDelete={(country: any) => {
          setCountryToDelete(country);
          setDeleteModalOpen(true);
        }}
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
