"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/store";
import AddOperatorModal from "@/components/modals/AddOperatorModal";
import OperatorsTable from "@/components/tables/OperatorTable";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { fetchCountries } from "@/store/slice/countrySlice";
import { addOperators, deleteOperator, getOperators, updateOperator } from "@/store/slice/operatorSlice";

export default function Operators() {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user }: any = useAppSelector((state) => state.user);
  const { operators } = useAppSelector((state) => state.operator);
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const [modalOpen, setModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch operators and countries
  const fetchData = async () => {
    await dispatch(getOperators({}));
    await dispatch(fetchCountries());
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id]);

  // Handle add or edit operator
  const handleSaveOperator = async (values, { resetForm }) => {

    // console.log("----- values in the add operators function -----", values);
    try {
      if (selectedOperator) {

        // console.log("---- values ----", { values.operators[0] });
        // return;
        const response = await dispatch(
          updateOperator({ operatorId: selectedOperator.id, updates: values.operators[0] })
        );

        console.log("---- response in the edit operator form ---", response);
        if (response?.type === 'operators/updateOperator/fulfilled') toast.success("Operator updated successfully");
      } else {
        const response = await dispatch(addOperators(values));
        if (response?.type === 'operators/addOperators/fulfilled') toast.success("Operator added successfully");
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

    // console.log("----- opeartor ----", operator);
    // return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await dispatch(deleteOperator(operator));
      // console.log("---- response in teh deleting the operator ----", response);

      if (response?.type === 'operators/deleteOperator/fulfilled') {
        await fetchData();
        toast.success("Operator deleted");
      }
      else {
        toast.error(response?.payload)
      }
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
      {/* <OperatorsTable
        operatorData={operators}
        onEdit={(operator) => {
          setSelectedOperator(operator);
          setIsEdit(true);
          setModalOpen(true);
        }}
        onDelete={(operator) => {
          setDeleteTarget(operator);
          setDeleteModalOpen(true);
        }}
      /> */}
      <OperatorsTable
        operatorData={operators.map((op) => ({
          ...op,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          countries: op.countries.map((c: any) => ({
            id: c.id,
            name: c.name,
            isoCode: c.isoCode,
            phoneCode: c.phoneCode || "", // provide default if missing
          })),
        }))}
        onEdit={(operator) => {
          setSelectedOperator(operator);
          setIsEdit(true);
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
