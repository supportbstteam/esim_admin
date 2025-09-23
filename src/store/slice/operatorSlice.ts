import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// ------------------- Types -------------------
export interface Operator {
    _id: string;
    name: string;
    code: string;
    countries: { _id: string; name: string; isoCode: string }[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OperatorState {
    operators: Operator[];
    operator: Operator | null;
    total: number;
    page: number;
    pages: number;
    loading: boolean;
    error: string | null;
}

const initialState: OperatorState = {
    operators: [],
    operator: null,
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
};

// ------------------- Async Thunks -------------------

// Create multiple operators
export const addOperators = createAsyncThunk(
    "operators/addOperators",
    async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        operators: any,
        { rejectWithValue }
    ) => {

        // console.log("---- operator in teh add opoerator slice ---", { operators });
        try {
            const res = await api<{ operators: Operator[] }>({
                url: "/admin/operator/create-operator",
                method: "POST",
                data: operators,
            });
            return res.operators;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Get operators (with filters + pagination)
export const getOperators = createAsyncThunk(
    "operators/getOperators",
    async (
        params: { name?: string; code?: string; country?: string; isActive?: boolean; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await api<{
                total: number;
                page: number;
                pages: number;
                operators: Operator[];
            }>({
                url: "/admin/operator",
                method: "GET",
                params,
            });
            return res;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Get single operator
export const getOperatorById = createAsyncThunk(
    "operators/getOperatorById",
    async (operatorId: string, { rejectWithValue }) => {
        try {
            const res = await api<{ operator: Operator }>({
                url: `/admin/operator/${operatorId}`,
                method: "GET",
            });
            return res.operator;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Update operator
export const updateOperator = createAsyncThunk(
    "operators/updateOperator",
    async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { operatorId, updates }: any,
        { rejectWithValue }
    ) => {
        try {
            const res = await api<{ operator: Operator }>({
                url: `/admin/operator/update/${operatorId}`,
                method: "PUT",
                data: updates,
            });
            return res.operator;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Soft delete operator
export const deleteOperator = createAsyncThunk(
    "operators/deleteOperator",
    async (operatorId: string, { rejectWithValue }) => {
        try {
            const res = await api<{ operator: Operator }>({
                url: `/admin/operator/delete/${operatorId}`,
                method: "DELETE",
            });
            return res.operator;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ------------------- Slice -------------------
const operatorSlice = createSlice({
    name: "operators",
    initialState,
    reducers: {
        clearOperator: (state) => {
            state.operator = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Add Operators
        builder.addCase(addOperators.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addOperators.fulfilled, (state, action: PayloadAction<Operator[]>) => {
            state.loading = false;
            state.operators.push(...action.payload);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(addOperators.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Get Operators
        builder.addCase(getOperators.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(getOperators.fulfilled, (state, action: any) => {
            state.loading = false;
            state.operators = action.payload.operators;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.pages = action.payload.pages;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(getOperators.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Get Single Operator
        builder.addCase(getOperatorById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getOperatorById.fulfilled, (state, action: PayloadAction<Operator>) => {
            state.loading = false;
            state.operator = action.payload;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(getOperatorById.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Update Operator
        builder.addCase(updateOperator.fulfilled, (state, action: PayloadAction<Operator>) => {
            state.loading = false;
            state.operators = state.operators.map((op) =>
                op._id === action.payload._id ? action.payload : op
            );
            if (state.operator?._id === action.payload._id) {
                state.operator = action.payload;
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(updateOperator.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete Operator
        builder.addCase(deleteOperator.fulfilled, (state, action: PayloadAction<Operator>) => {
            state.loading = false;
            state.operators = state.operators.map((op) =>
                op._id === action.payload._id ? action.payload : op
            );
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase(deleteOperator.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { clearOperator, clearError } = operatorSlice.actions;
export default operatorSlice.reducer;
