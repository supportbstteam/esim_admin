import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api"; // <-- adjust path
import { deleteQuery } from "../querySlice";
import { Device, DeviceOS, DeviceQuery } from "@/lib/types";


// Fetch devices
export const fetchDevices = createAsyncThunk(
    "devices/fetch",
    async (query: DeviceQuery, { rejectWithValue }) => {
        try {
            const response = await api<{
                page: number;
                limit: number;
                total: number;
                pages: number;
                data: Device[];
            }>({
                url: "/admin/devices",
                method: "GET",
                params: query,
            });

            return response;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Fetch failed");
        }
    }
);

// Bulk import (your JSON)
export const importDevices = createAsyncThunk(
    "devices/import",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (payload: any[], { rejectWithValue }) => {
        try {
            return await api({
                url: "/admin/devices/bulk",
                method: "POST",
                data: { data: payload },
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);




// Create single device
export const createDevice = createAsyncThunk<
    Device,                    // return type to slice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any        // payload type
>(
    "devices/create",
    async (device, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await api<any>({
                url: "/admin/devices/add",
                method: "POST",
                data: {
                    data: [device],     // matches your backend contract
                },
            });

            // console.log("-=-=--= response in the add create device -=-=-=-", response);

            // Return first created device for store update
            return response;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Create device failed"
            );
        }
    }
);

// UPDATE DEVICE
export const updateDevice = createAsyncThunk(
    "devices/update",
    async (
        {
            id,
            data,
        }: {
            id: number;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await api({
                url: `/admin/devices/${id}`,
                method: "PUT",
                data,
            });

            return response;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Toggle active
export const toggleDevice = createAsyncThunk<
    { id: number; isActive: boolean },     // ✅ response
    { id: number; isActive: boolean },     // ✅ arg
    { rejectValue: string }
>(
    "devices/toggle",
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `/admin/devices/${id}/status`,
                method: "PATCH",
                data: { isActive },
            });

            return res;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Toggle failed"
            );
        }
    }
);




// Delete
export const deleteDevice = createAsyncThunk(
    "devices/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await api({
                url: `/admin/devices/${id}/permanent`,
                method: "DELETE",
            });

            return id;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);
