import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Plan {
    id: number;
    title: string;
    name: string;
    data: number | string;
    call: number | string;
    sms: number | string;
    is_unlimited: boolean;
    validity_days: number | string;
    price: number | string;
    currency: string;
    country_id: string;
}

interface PlansState {
    topups: Plan[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: PlansState = {
    topups: [],
    loading: false,
    error: null,
};

export const fetchThirdPartyTopupPlans = createAsyncThunk(
    "topupPlans/fetchThirdPartyTopupPlans",// eslint-disable-next-line @typescript-eslint/no-explicit-any
    // async (params: Record<string, any> = {}, { rejectWithValue }) => {
    async (_, { rejectWithValue }) => {
        try {
            const data = await api<Plan[]>({
                url: "/admin/third-party-api/services/top-up",
                method: "GET",
                // params,
            });
            return data;// eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const thirdPartyTopupSlice = createSlice({
    name: "topupPlans",
    initialState,
    reducers: {
        clearPlans(state) {
            state.topups = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        fetchThirdPartyTopupPlans
        builder.addCase(fetchThirdPartyTopupPlans.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchThirdPartyTopupPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
            state.loading = false;
            state.topups = action.payload;
        });// eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(fetchThirdPartyTopupPlans.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { clearPlans } = thirdPartyTopupSlice.actions;

export default thirdPartyTopupSlice.reducer;
