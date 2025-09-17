"use client";

import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const countryUrl: string = "/admin/countries"

// 🔹 Country type
export interface Country {
    _id?: string;
    name: string;
    isoCode: string;
    iso3Code?: string;
    phoneCode: string;
    currency: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// 🔹 State type
interface CountryState {
    countries: Country[];
    loading: boolean;
    error: string | null;
}

const initialState: CountryState = {
    countries: [],
    loading: false,
    error: null,
};

// =====================
// 🔹 Async thunks
// =====================

// GET all countries
export const fetchCountries = createAsyncThunk<Country[]>(
    "countries/fetchAll",
    async (_, thunkAPI) => {
        try {
            return await api<Country[]>({ url: countryUrl + "/", method: "GET" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch countries");
        }
    }
);

// CREATE country
export const createCountry = createAsyncThunk<Country, Omit<Country, "_id">>(
    "countries/create",
    async (newCountry, thunkAPI) => {
        try {
            return await api<Country>({ url: countryUrl + "/add-country", method: "POST", data: newCountry });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create country");
        }
    }
);

// UPDATE country
export const updateCountry = createAsyncThunk<Country, { id: string; data: Partial<Country> }>(
    "countries/update",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ id, data }: any, thunkAPI) => {
        try {
            return await api<Country>({ url: `${countryUrl}/update/${id}`, method: "PUT", data });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update country");
        }
    }
);

// DELETE country
export const deleteCountry = createAsyncThunk<string, string>(
    "countries/delete",
    async (id, thunkAPI) => {
        try {
            await api({ url: `${countryUrl}/delete/${id}`, method: "DELETE" });
            return id;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete country");
        }
    }
);

// =====================
// 🔹 Slice
// =====================
const countrySlice = createSlice({
    name: "countries",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // FETCH
        builder.addCase(fetchCountries.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCountries.fulfilled, (state, action: PayloadAction<Country[]>) => {
            state.loading = false;
            state.countries = action.payload;
        });
        builder.addCase(fetchCountries.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // CREATE
        builder.addCase(createCountry.fulfilled, (state, action: PayloadAction<Country>) => {
            state.countries.push(action.payload);
        });

        // UPDATE
        builder.addCase(updateCountry.fulfilled, (state, action: PayloadAction<Country>) => {
            const idx = state.countries.findIndex((c) => c._id === action.payload._id);
            if (idx !== -1) state.countries[idx] = action.payload;
        });

        // DELETE
        builder.addCase(deleteCountry.fulfilled, (state, action: PayloadAction<string>) => {
            state.countries = state.countries.filter((c) => c._id !== action.payload);
        });
    },
});

export default countrySlice.reducer;
