"use client";
import AddOperatorModal from "@/components/modals/AddOperatorModal";
import OperatorsTable from "@/components/tables/OperatorTable";
import { useAppDispatch } from "@/store";
import { fetchCountries } from "@/store/slice/countrySlice";
import { addOperators, deleteOperator, getOperators } from "@/store/slice/operatorSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Operators() {
    const dispatch = useAppDispatch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = useSelector((state: any) => state.user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { operators } = useSelector((state: any) => state.operator);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchSims = async () => {
        await dispatch(getOperators({}));
        await dispatch(fetchCountries());
    };

    useEffect(() => {
        fetchSims();
    }, [user?._id]);

    const handleAddOperator = async (values, { resetForm }) => {

        const { operators } = values;
        if (!operators)
            toast.error("Please fill all the required fields")

        try {
            const response = await dispatch(addOperators(operators));
            if (response?.type === "operators/addOperators/fulfilled") {
                toast.success("Operator added successfully")
            }
            else if (response?.type === "operators/addOperators/rejected") {
                toast.error(`${response?.payload}`)

            }
        }
        catch (err) {
            console.error("Error in the Adding Operator", err);
        }
        resetForm();
        setModalOpen(false);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Operators</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-6 py-2 font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                    + Add Operator
                </button>
            </div>
            <OperatorsTable operatorData={operators} onEdit={(values) => {
                console.log("--- values in the edit ----", values)
            }}
                onDelete={async (values) => {
                    await dispatch(deleteOperator(values));
                    await fetchSims();
                }}
            />
            <AddOperatorModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                handleSubmit={handleAddOperator}
            />
        </div>
    );
}
