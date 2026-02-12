import { createSlice } from "@reduxjs/toolkit";
import {
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    disableBrand,
    restoreBrand,
} from "./brandThunks";
import { Brand } from "@/lib/types";

interface State {
    list: Brand[];
    loading: boolean;
    error?: string;
}

const initialState: State = {
    list: [],
    loading: false,
};

const slice = createSlice({
    name: "brands",
    initialState,
    reducers: {},

    extraReducers: (builder) => {

        builder

            // FETCH
            .addCase(fetchBrands.pending, (s) => {
                s.loading = true;
            })
            .addCase(fetchBrands.fulfilled, (s, a) => {
                s.loading = false;
                s.list = a.payload;
            })

            // CREATE
            .addCase(createBrand.pending, (s) => {
                s.loading = true;
            })
            .addCase(createBrand.fulfilled, (s) => {
                s.loading = false;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .addCase(createBrand.rejected, (s, a: any) => {
                s.loading = false;
                s.error = a.payload?.message;
            })

            // UPDATE
            .addCase(updateBrand.fulfilled, (s, a) => {
                const i = s.list.findIndex(b => b.id === a.payload.id);
                if (i !== -1) s.list[i] = a.payload;
            })

            // DELETE
            .addCase(deleteBrand.fulfilled, (s, a) => {
                s.list = s.list.filter(b => b.id !== a.payload);
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .addCase(disableBrand.fulfilled, (s, a: any) => {
                const id = a.meta.arg;
                const b = s.list.find(x => x.id === id);
                if (b) b.isActive = false;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .addCase(restoreBrand.fulfilled, (s, a: any) => {
                const id = a.meta.arg;
                const b = s.list.find(x => x.id === id);
                if (b) b.isActive = true;
            })

            .addMatcher(
                (a) => a.type.endsWith("/rejected"),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (s, a: any) => {
                    s.loading = false;
                    s.error = a.payload?.message;
                }
            );
    }
});

export default slice.reducer;
