"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store";
import AddOperatorModal from "@/components/modals/AddOperatorModal";
import OperatorsTable from "@/components/tables/OperatorTable";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { fetchCountries } from "@/store/slice/countrySlice";
import { addOperators, deleteOperator, getOperators, updateOperator } from "@/store/slice/operatorSlice";

export default function Operators() {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.user);
  const { operators } = useSelector((state: any) => state.operator);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch operators and countries
  const fetchData = async () => {
    await dispatch(getOperators({}));
    await dispatch(fetchCountries());
  };

  useEffect(() => {
    if (user?._id) fetchData();
  }, [user?._id]);

  // Handle add or edit operator
  const handleSaveOperator = async (values, { resetForm }) => {
    try {
      if (selectedOperator) {
        const response = await dispatch(
          updateOperator({ id: selectedOperator._id, ...values.operators[0] })
        );
        if (response?.type.endsWith("fulfilled")) toast.success("Operator updated successfully");
      } else {
        const response = await dispatch(addOperators(values));
        if (response?.type.endsWith("fulfilled")) toast.success("Operator added successfully");
      }
      await fetchData();
    } catch (err) {
      console.error("Error saving operator", err);
      toast.error("Something went wrong");
    }
    resetForm();
    setModalOpen(false);
    setSelectedOperator(null);
  };

  // Handle delete operator
  const handleDeleteOperator = async (operator) => {
    try {
      await dispatch(deleteOperator(operator._id));
      await fetchData();
      toast.success("Operator deleted");
    } catch (err) {
      console.error("Error deleting operator", err);
      toast.error("Something went wrong");
    }
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Operators</h1>
        <button
          onClick={() => {
            setSelectedOperator(null);
            setModalOpen(true);
          }}
          className="px-6 py-2 font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          + Add Operator
        </button>
      </div>

      {/* Operators Table */}
      <OperatorsTable
        operatorData={operators}
        onEdit={(operator) => {
          setSelectedOperator(operator);
          setModalOpen(true);
        }}
        onDelete={(operator) => {
          setDeleteTarget(operator);
          setDeleteModalOpen(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteTarget && handleDeleteOperator(deleteTarget)}
        operatorName={deleteTarget?.name}
      />

      {/* Add / Edit Operator Modal */}
      <AddOperatorModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedOperator(null);
        }}
        handleSubmit={handleSaveOperator}
        operator={selectedOperator} // prefill modal for editing
      />
    </div>
  );
}
