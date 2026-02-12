import { createSlice } from "@reduxjs/toolkit";
import {
    fetchDevices,
    importDevices,
    createDevice,
    toggleDevice,
    deleteDevice,
    updateDevice,
} from "./deviceThunks";
import { Device, DeviceOS } from "@/lib/types";

interface DeviceState {
    list: Device[];

    page: number;
    pages: number;
    total: number;
    limit: number;

    loading: boolean;
    error: string | null;
}

const initialState: DeviceState = {
    list: [],
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
    loading: false,
    error: null,
};

const slice = createSlice({
    name: "devices",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            // FETCH
            .addCase(fetchDevices.pending, (s) => {
                s.loading = true;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .addCase(fetchDevices.fulfilled, (s: any, a) => {
                s.loading = false;
                s.list = a.payload.data;
                s.page = a.payload.page;
                s.pages = a.payload.pages;
                s.total = a.payload.total;
                s.limit = a.payload.limit;
            })

            .addCase(fetchDevices.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload as string;
            })
            // CREATE
            .addCase(createDevice.fulfilled, (s, a) => {
                s.list.unshift(a.payload);
            })

            // TOGGLE
            .addCase(toggleDevice.fulfilled, (s, a) => {
                const idx = s.list.findIndex(d => d.id === a.payload.id);

                if (idx !== -1) {
                    s.list[idx].isActive = a.payload.isActive;
                }
            })
            .addCase(toggleDevice.rejected, (s, a) => {
                s.error = a.payload || "Toggle failed";
            })

            // UPDATE
            .addCase(updateDevice.fulfilled, (s, a) => {
                const idx = s.list.findIndex(d => d.id === a.payload.id);

                if (idx !== -1) {
                    s.list[idx] = a.payload;
                }
            })
            .addCase(updateDevice.rejected, (s, a) => {
                s.error = a.payload as string;
            })

            // DELETE
            .addCase(deleteDevice.fulfilled, (s, a) => {
                s.list = s.list.filter(d => d.id !== a.payload);
            });
    },
});

export default slice.reducer;
