import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define TypeScript types for your order (simplified)
interface Order {
    id: string;
    status: string;
    activated: boolean;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    user: { id: string; firstName: string; lastName: string; email: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plan?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transaction?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    esim?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    country?: any;
    errorMessage?: string;
}

interface OrderState {
    orders: Order[];
    order: Order | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
};

// Fetch all orders
export const fetchOrders = createAsyncThunk("adminOrders/fetchAll", async (_, thunkAPI) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await api<Order[]>({ url: "/admin/orders", method: "GET" });
        return response?.orders;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Fetch single order by ID
export const fetchOrderById = createAsyncThunk(
    "adminOrders/fetchById",
    async (id: string, thunkAPI) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await api<Order[]>({ url: `/admin/orders/${id}`, method: "GET" });

            return response?.order;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Update order
export const updateOrder = createAsyncThunk(
    "adminOrders/update",  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ id, data }: { id: string; data: any }, thunkAPI) => {
        try {
            return await api<Order>({
                url: `/admin/orders/update/${id}`,
                method: "PATCH",
                data,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Delete order
export const deleteOrder = createAsyncThunk(
    "adminOrders/delete",
    async (id: string, thunkAPI) => {
        try {
            return await api<{ message: string }>({ url: `/admin/orders/delete/${id}`, method: "DELETE" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState,
    reducers: {
        clearOrderError: (state) => {
            state.error = null;
        },
        clearSelectedOrder: (state) => {
            state.order = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all orders
        builder.addCase(fetchOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
            state.loading = false;
            state.orders = action.payload;
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch single order
        builder.addCase(fetchOrderById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
            state.loading = false;
            state.order = action.payload;
        });
        builder.addCase(fetchOrderById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update order
        builder.addCase(updateOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
            state.loading = false;
            // Update in orders array
            const index = state.orders.findIndex((o) => o.id === action.payload.id);
            if (index !== -1) state.orders[index] = action.payload;
            if (state.order?.id === action.payload.id) state.order = action.payload;
        });
        builder.addCase(updateOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete order
        builder.addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            // Remove deleted order from orders array
            state.orders = state.orders.filter((o) => o.id !== (action.meta.arg as string));
            if (state.order?.id === (action.meta.arg as string)) state.order = null;
        });
        builder.addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearOrderError, clearSelectedOrder } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
