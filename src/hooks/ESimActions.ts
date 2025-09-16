"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store"; // adjust path
import { useCallback } from "react";
import {
    fetchESims,
    createESim,
    updateESim,
    deleteESim,
    resetError,
    ESIM,
} from "@/store/slice/eSimSlice";

export const useESimActions = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Redux state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { eSims, loading, error } = useSelector((state: any) => state.eSim);

    // Thunk wrappers
    const getAllESims = useCallback(() => dispatch(fetchESims()), [dispatch]);
    const addESim = useCallback((data: Partial<ESIM>) => dispatch(createESim(data)), [dispatch]);
    const editESim = useCallback(
        (id: string, updates: Partial<ESIM>) => dispatch(updateESim({ id, updates })),
        [dispatch]
    );
    const removeESim = useCallback((id: string) => dispatch(deleteESim(id)), [dispatch]);
    const clearError = useCallback(() => dispatch(resetError()), [dispatch]);

    return {
        eSims,
        loading,
        error,
        getAllESims,
        addESim,
        editESim,
        removeESim,
        clearError,
    };
};
