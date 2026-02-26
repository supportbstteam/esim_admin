import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import { Brand } from "@/lib/types";


// =============================
// Fetch Brands
// =============================
export const fetchBrands = createAsyncThunk(
    "brands/fetch",
    async (_, { rejectWithValue }) => {
        try {
            return await api<Brand[]>({
                url: "/admin/brands",
                method: "GET",
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);


// =============================
// Create Brand(s)
// Accepts string | string[]
// =============================
// CREATE BRAND(S)
export const createBrand = createAsyncThunk(
    "brands/create",
    async (
        payload: { name?: string; brand?: string, status: boolean },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const res = await api({
                url: "/admin/brands/add",
                method: "POST",
                data: payload,
            });

            // 🔥 important — refresh list
            dispatch(fetchBrands());

            return res;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// =============================
// Update Brand
// =============================
export const updateBrand = createAsyncThunk(
    "brands/update",
    async (
        { id, name, status }: { id: number; name: string, status:boolean },
        { rejectWithValue }
    ) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return await api<any>({
                url: `/admin/brands/${id}`,
                method: "PUT",
                data: { name, status },
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);


// =============================
// Delete Brand (Cascade Devices)
// =============================
export const deleteBrand = createAsyncThunk(
    "brands/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await api({
                url: `/admin/brands/${id}`,
                method: "DELETE",
            });

            return id;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const disableBrand = createAsyncThunk(
    "brands/disable",
    async (id: number, { rejectWithValue }) => {
        try {
            return await api({
                url: `/admin/brands/${id}/disable`,
                method: "PATCH",
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const restoreBrand = createAsyncThunk(
    "brands/restore",
    async (id: number, { rejectWithValue }) => {
        try {
            return await api({
                url: `/admin/brands/${id}/restore`,
                method: "PATCH",
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

