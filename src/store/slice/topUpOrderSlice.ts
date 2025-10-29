import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface TopUpOrder {
    id: string;
    status: string;
    activated: boolean;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    user: { id: string; firstName: string; lastName: string; email: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transaction?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    country?: any;
    errorMessage?: string;
}

interface TopUpOrderState {
    topUpOrders: TopUpOrder[];
    topUpOrder: TopUpOrder | null;
    loading: boolean;
    error: string | null;
}

const initialState: TopUpOrderState = {
    topUpOrders: [],
    topUpOrder: null,
    loading: false,
    error: null,
};

// Fetch all Top-Up orders
export const fetchTopUpOrders = createAsyncThunk(
    "adminTopUpOrders/fetchAll",
    async (_, thunkAPI) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await api<TopUpOrder[]>({
                url: "/admin/orders/top-up",
                method: "GET",
            });
            return response?.orders;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Fetch single Top-Up order
export const fetchTopUpOrderById = createAsyncThunk(
    "adminTopUpOrders/fetchById",
    async (id: string, thunkAPI) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await api<TopUpOrder>({
                url: `/admin/orders/top-up/${id}`,
                method: "GET",
            });
            return response?.order;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Update Top-Up order
export const updateTopUpOrder = createAsyncThunk(
    "adminTopUpOrders/update",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ id, data }: { id: string; data: any }, thunkAPI) => {
        try {
            return await api<TopUpOrder>({
                url: `/admin/orders/top-up/${id}`,
                method: "PATCH",
                data,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Delete Top-Up order
export const deleteTopUpOrder = createAsyncThunk(
    "adminTopUpOrders/delete",
    async (id: string, thunkAPI) => {
        try {
            return await api<{ message: string }>({
                url: `/admin/orders/top-up/${id}`,
                method: "DELETE",
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const adminTopUpOrderSlice = createSlice({
    name: "adminTopUpOrders",
    initialState,
    reducers: {
        clearTopUpOrderError: (state) => {
            state.error = null;
        },
        clearSelectedTopUpOrder: (state) => {
            state.topUpOrder = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all
        builder.addCase(fetchTopUpOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTopUpOrders.fulfilled, (state, action: PayloadAction<TopUpOrder[]>) => {
            state.loading = false;
            state.topUpOrders = action.payload;
        });
        builder.addCase(fetchTopUpOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch single
        builder.addCase(fetchTopUpOrderById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTopUpOrderById.fulfilled, (state, action: PayloadAction<TopUpOrder>) => {
            state.loading = false;
            state.topUpOrder = action.payload;
        });
        builder.addCase(fetchTopUpOrderById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update
        builder.addCase(updateTopUpOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateTopUpOrder.fulfilled, (state, action: PayloadAction<TopUpOrder>) => {
            state.loading = false;
            const index = state.topUpOrders.findIndex((o) => o.id === action.payload.id);
            if (index !== -1) state.topUpOrders[index] = action.payload;
            if (state.topUpOrder?.id === action.payload.id) state.topUpOrder = action.payload;
        });
        builder.addCase(updateTopUpOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete
        builder.addCase(deleteTopUpOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteTopUpOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.topUpOrders = state.topUpOrders.filter(
                (o) => o.id !== (action.meta.arg as string)
            );
            if (state.topUpOrder?.id === (action.meta.arg as string)) state.topUpOrder = null;
        });
        builder.addCase(deleteTopUpOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearTopUpOrderError, clearSelectedTopUpOrder } =
    adminTopUpOrderSlice.actions;

export default adminTopUpOrderSlice.reducer;
