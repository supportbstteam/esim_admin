import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


// Define your Plan and Topup types
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
    apiPlans: Plan[];
    // topups: Plan[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: PlansState = {
    apiPlans: [],
    // topups: [],
    loading: false,
    error: null,
};

// =====================
// Async thunks using api
// =====================

export const fetchThirdPartyPlans = createAsyncThunk(
    "plans/fetchThirdPartyPlans",// eslint-disable-next-line @typescript-eslint/no-explicit-any
    // async (params: Record<string, any> = {}, { rejectWithValue }) => {
    async (_, { rejectWithValue }) => {
        try {
            const data = await api<Plan[]>({
                url: "/admin/third-party-api/services/plans",
                method: "GET",
                // params,
            });
            return data;// eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// export const fetchThirdPartyTopupPlans = createAsyncThunk(
//     "plans/fetchThirdPartyTopupPlans",// eslint-disable-next-line @typescript-eslint/no-explicit-any
//     async (params: Record<string, any> = {}, { rejectWithValue }) => {
//         try {
//             const data = await api<Plan[]>({
//                 url: "/v2/plans/topup-plans",
//                 method: "GET",
//                 params,
//             });
//             return data;// eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (err: any) {
//             return rejectWithValue(err.response?.data || err.message);
//         }
//     }
// );

// =====================
// Slice
// =====================

const thirdPartyPlanSlice = createSlice({
    name: "plans",
    initialState,
    reducers: {
        clearPlans(state) {
            state.apiPlans = [];
            // state.topups = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchThirdPartyPlans
        builder.addCase(fetchThirdPartyPlans.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchThirdPartyPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
            state.loading = false;
            state.apiPlans = action.payload;
        });// eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(fetchThirdPartyPlans.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });

        // fetchThirdPartyTopupPlans
        // builder.addCase(fetchThirdPartyTopupPlans.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // });
        // builder.addCase(fetchThirdPartyTopupPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        //     state.loading = false;
        //     state.topups = action.payload;
        // });// eslint-disable-next-line @typescript-eslint/no-explicit-any
        // builder.addCase(fetchThirdPartyTopupPlans.rejected, (state, action: PayloadAction<any>) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // });
    },
});

export const { clearPlans } = thirdPartyPlanSlice.actions;

export default thirdPartyPlanSlice.reducer;
