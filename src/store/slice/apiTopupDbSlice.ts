// src/store/slices/topupPlansSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// --- Types ---
export interface TopupPlan {
    id: string;              // UUID (internal)
    topupId: number;         // external ID
    title: string;
    name: string;
    dataLimit: number;
    validityDays: number;
    isUnlimited: boolean;
    price: number;
    currency: string;
    country: {
        id: string;
        name: string;
        code: string;
        iso3: string;
    };
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TopupPlansState {
    items: TopupPlan[];
    loading: boolean;
    error: string | null;
}

// --- Initial State ---
const initialState: TopupPlansState = {
    items: [],
    loading: false,
    error: null,
};

// --- Thunks ---
// Fetch all topup plans (optionally by countryId)
export const fetchTopupPlans = createAsyncThunk(
    "topupPlans/fetchAll",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await api({
                url: "/admin/top-up/",
                method: "GET",
                // params: countryId ? { countryId } : {},
            });

            // console.log("---- data in the top op fetch -----", data);


            return data?.plans;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return (err.response?.data || err.message);
        }
    }
);

// Create plans (accepts single or array payload)
export const createTopupPlans = createAsyncThunk(
    "topupPlans/create",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (plans: any, { rejectWithValue }) => {
        try {
            const data = await api<{ plans: TopupPlan[] }>({
                url: "/admin/top-up/create-topup",
                method: "POST",
                data: plans,
            });
            return data.plans;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Update a plan
export const updateTopupPlan = createAsyncThunk(
    "topupPlans/update",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ id, updates }: any, { rejectWithValue }) => {
        try {
            const data = await api<{ plan: TopupPlan }>({
                url: `/admin/top-up/${id}`,
                method: "PUT",
                data: updates,
            });
            return data.plan;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Soft delete a plan
export const deleteTopupPlan = createAsyncThunk(
    "topupPlans/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await api({
                url: `/admin/top-up/${id}`,
                method: "DELETE",
            });
            return id;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// --- Slice ---
const topupPlansSlice = createSlice({
    name: "topupPlans",
    initialState,
    reducers: {
        clearTopupPlans(state) {
            state.items = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetch
        builder.addCase(fetchTopupPlans.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTopupPlans.fulfilled, (state, action: PayloadAction<TopupPlan[]>) => {
            state.loading = false;
            state.items = action.payload;
        });// eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(fetchTopupPlans.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });

        // create
        builder.addCase(createTopupPlans.fulfilled, (state, action: PayloadAction<TopupPlan[]>) => {
            state.items.push(...action.payload);
        });

        // update
        builder.addCase(updateTopupPlan.fulfilled, (state, action: PayloadAction<TopupPlan>) => {
            const idx = state.items.findIndex((p) => p.id === action.payload.id);
            if (idx !== -1) {
                state.items[idx] = action.payload;
            }
        });

        // delete
        builder.addCase(deleteTopupPlan.fulfilled, (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((p) => p.id !== action.payload);
        });
    },
});

export const { clearTopupPlans } = topupPlansSlice.actions;

export default topupPlansSlice.reducer;
