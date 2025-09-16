// src/store/slices/eSimSlice.ts
import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// E-SIM type
export interface ESIM {
    _id: string;
    simNumber: string;
    countryName: string;
    countryCode: string;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    isDeleted: boolean;
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    } | null;
    plans: Array<{ _id: string; name: string }>;
    company: { _id: string; name: string };
}

interface ESimState {
    eSims: ESIM[];
    loading: boolean;
    error: string | null;
}

const initialState: ESimState = {
    eSims: [],
    loading: false,
    error: null,
};

// ----------------- Thunks -----------------

export const fetchESims = createAsyncThunk("eSim/fetchESims", async (_, thunkAPI) => {
    try {
        const data: any = await api<ESIM[]>({ url: "/admin/e-sim/", method: "GET" });

        console.log("---- data in the esims ----", data);
        return data.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const createESim = createAsyncThunk(
    "eSim/createESim",
    async (eSimData: Partial<ESIM>, thunkAPI) => {
        try {
            const data = await api<ESIM, Partial<ESIM>>({
                url: "/admin/e-sim/create-sim",
                method: "POST",
                data: eSimData,
            });
            return data.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateESim = createAsyncThunk(
    "eSim/updateESim",
    async ({ id, updates }: { id: string; updates: Partial<ESIM> }, thunkAPI) => {
        try {
            const data = await api<ESIM, Partial<ESIM>>({
                url: `/admin/e-sim/${id}`,
                method: "PUT",
                data: updates,
            });
            return data.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteESim = createAsyncThunk(
    "eSim/deleteESim",
    async (id: string, thunkAPI) => {
        try {
            const response = await api<void>({ url: `/admin/e-sim/${id}`, method: "DELETE" });
            console.log("---- removing e-sim -----", response );
            return id;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ----------------- Slice -----------------
const eSimSlice = createSlice({
    name: "eSim",
    initialState,
    reducers: {
        resetError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch
        builder.addCase(fetchESims.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchESims.fulfilled, (state, action: PayloadAction<ESIM[]>) => {
            state.loading = false;
            state.eSims = action.payload;
        });
        builder.addCase(fetchESims.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Create
        builder.addCase(createESim.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createESim.fulfilled, (state, action: PayloadAction<ESIM>) => {
            state.loading = false;
            state.eSims.push(action.payload);
        });
        builder.addCase(createESim.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Update
        builder.addCase(updateESim.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateESim.fulfilled, (state, action: PayloadAction<ESIM>) => {
            state.loading = false;
            const index = state.eSims.findIndex((e) => e._id === action.payload._id);
            if (index !== -1) state.eSims[index] = action.payload;
        });
        builder.addCase(updateESim.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete
        builder.addCase(deleteESim.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteESim.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.eSims = state.eSims.filter((e) => e._id !== action.payload);
        });
        builder.addCase(deleteESim.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { resetError } = eSimSlice.actions;
export default eSimSlice.reducer;
