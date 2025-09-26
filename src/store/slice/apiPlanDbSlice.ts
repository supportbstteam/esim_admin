import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// =====================
// Types
// =====================
export interface Plan {
  planId: number;
  title: string;
  name: string;
  data: number | string;
  call: number | string;
  sms: number | string;
  isUnlimited: boolean;
  validityDays: number | string;
  price: number | string;
  currency: string;
  country_id: string;
  country?: { id: string; name: string; code?: string; iso3?: string };
}

interface PlansDbState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
}

interface ApiError {
  message: string;
}

// =====================
// Initial State
// =====================
const initialState: PlansDbState = {
  plans: [],
  loading: false,
  error: null,
};

// =====================
// Async thunks
// =====================
export const fetchPlansDb = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any, // return type
  void, // arg type → no arguments
  { rejectValue: ApiError }
>("plansDb/fetchPlans", async (_, { rejectWithValue }) => {
  try {
    const data = await api<{ count: number; plans: Plan[] }>({
      url: "/admin/plans",
      method: "GET",
    });
    return data.plans;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPlansDb = createAsyncThunk<any>("plansDb/createPlans", async (plans: any, { rejectWithValue }: any) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await api({
      url: "/admin/plans/create-plan",
      method: "POST",
      data: Array.isArray(plans) ? plans : [plans],
    });
    return data.plans;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const updatePlanDb = createAsyncThunk<
  Plan,
  { planId: number; data: Partial<Plan> },
  { rejectValue: ApiError }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
>("plansDb/updatePlan", async ({ planId, data }: any, { rejectWithValue }) => {
  try {
    const res = await api<{ plan: Plan }>({
      url: `/admin/plans/${planId}`,
      method: "PUT",
      data,
    });
    return res.plan;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const deletePlanDb = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiError }
>("plansDb/deletePlan", async (planId, { rejectWithValue }) => {
  try {
    await api({ url: `/admin/plans/${planId}`, method: "DELETE" });
    return planId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

// =====================
// Slice
// =====================
const plansDbSlice = createSlice({
  name: "plansDb",
  initialState,
  reducers: {
    clearPlansDb(state) {
      state.plans = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPlansDb
    builder
      .addCase(fetchPlansDb.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlansDb.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlansDb.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch plans";
      });

    // createPlansDb
    builder
      .addCase(createPlansDb.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlansDb.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        state.loading = false;
        state.plans = [...state.plans, ...action.payload];
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(createPlansDb.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create plans";
      });

    // updatePlanDb
    builder
      .addCase(updatePlanDb.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlanDb.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.loading = false;
        state.plans = state.plans.map((p) =>
          p.planId === action.payload.planId ? action.payload : p
        );
      })
      .addCase(updatePlanDb.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update plan";
      });

    // deletePlanDb
    builder
      .addCase(deletePlanDb.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlanDb.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.plans = state.plans.filter((p) => p.planId !== action.payload);
      })
      .addCase(deletePlanDb.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete plan";
      });
  },
});

export const { clearPlansDb } = plansDbSlice.actions;
export default plansDbSlice.reducer;
