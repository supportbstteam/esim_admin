"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '@/store/slice/countrySlice';
import Loader from '@/components/loader';
import CountryTable from '@/components/tables/CountryTable';
import AddCountryModal from '@/components/modals/AddCountryModal'
// import AddCountryModal from '@/components/Modals/AddCountryModal';
// import CountryTable from '@/components/Tables/CountryTable';

function Country() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: any = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { countries, loading } = useSelector((state: any) => state?.countries);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      await dispatch(fetchCountries());
    }
    fetchCountry();
  }, [dispatch]);

  if (loading) return <Loader />

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Countries Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-[#16325d] to-[#37c74f] hover:from-[#37c74f] hover:to-[#16325d] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Country
        </button>
      </div>

      {/* Countries Table */}
      <CountryTable countries={countries} />

      {/* Add Country Modal */}
      <AddCountryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          dispatch(fetchCountries());
        }}
      />
    </div>
  );
}

export default Country;
