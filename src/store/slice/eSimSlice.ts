// src/store/slices/eSimSlice.ts
import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// E-SIM type
export interface ESIM {
    id: string;
    simNumber: string;
    countryName: string;
    countryCode: string;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    isDeleted: boolean;
    assignedTo?: {
        id: string;
        name: string;
        email: string;
    } | null;
    plans: Array<{ id: string; name: string }>;
    company: { id: string; name: string };
}

interface ESimState {
    eSims: ESIM[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eSimDetails: any; // ✅ added
    loading: boolean;
    error: string | null;
}

const initialState: ESimState = {
    eSims: [],
    eSimDetails: null, // ✅ added
    loading: false,
    error: null,
};

// ----------------- Thunks -----------------

export const fetchESims = createAsyncThunk("eSim/fetchESims", async (_, thunkAPI) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await api<ESIM[]>({ url: "/admin/e-sim/all", method: "GET" });

        console.log("---- data in the esims ----", data);
        return data.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const createESim = createAsyncThunk(
    "eSim/createESim",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (eSimData: any, thunkAPI) => {
        try {
            // Wrap the array into an object with key `sims` to match backend expectation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload: any = { sims: eSimData };

            console.log("---- payload -----", payload)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await api<{ message: string; data: any[] }, typeof payload>({
                url: "/admin/e-sim/create-sim",
                method: "POST",
                data: payload,
            });

            return data.data; // this is an array of created SIMs
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Fetch single eSIM details
export const fetchESimDetails = createAsyncThunk(
    "eSim/fetchESimDetails",
    async (id: string, thunkAPI) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await api<ESIM>({ url: `/admin/e-sim/${id}`, method: "GET" });
            return data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateESim = createAsyncThunk(
    "eSim/updateESim",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ id, updates }: { id: string; updates: any }, thunkAPI) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await api<ESIM, Partial<ESIM>>({
                url: `/admin/e-sim/${id}`,
                method: "PUT",
                data: updates,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            console.log("---- removing e-sim -----", response);
            return id;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(fetchESims.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(fetchESimDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchESimDetails.fulfilled, (state, action: PayloadAction<ESIM>) => {
            state.loading = false;
            state.eSimDetails = action.payload;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(fetchESimDetails.rejected, (state, action: PayloadAction<any>) => {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            const index = state.eSims.findIndex((e) => e.id === action.payload.id);
            if (index !== -1) state.eSims[index] = action.payload;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            state.eSims = state.eSims.filter((e) => e.id !== action.payload);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(deleteESim.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { resetError } = eSimSlice.actions;
export default eSimSlice.reducer;
