import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface TopUpOrder {
  id: string;
  status: string;
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

interface TopUpOrderState {
  topUpOrders: TopUpOrder[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topUpOrder: any;
  loading: boolean;
  error: string | null;
}

const initialState: TopUpOrderState = {
  topUpOrders: [],
  topUpOrder: null,
  loading: false,
  error: null,
};

// Base URL
const topUpUrl = "/admin/orders/top-up";

// Fetch all top-up orders
export const fetchTopUpOrders = createAsyncThunk(
  "topUpOrders/fetchAll",
  async (_, thunkAPI) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api<TopUpOrder[]>({
        url: `${topUpUrl}`,
        method: "GET",
      });
      return response?.orders;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch single top-up order by ID
export const fetchTopUpOrderById = createAsyncThunk(
  "topUpOrders/fetchById",
  async (id: string, thunkAPI) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api<TopUpOrder>({
        url: `${topUpUrl}/${id}`,
        method: "GET",
      });
      // console.log("---- response in teh top by id 0----", response);
      return response?.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create top-up order
export const createTopUpOrder = createAsyncThunk(
  "topUpOrders/create",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: any, thunkAPI) => {
    try {
      return await api<TopUpOrder>({
        url: `${topUpUrl}/create`,
        method: "POST",
        data,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update top-up order
export const updateTopUpOrder = createAsyncThunk(
  "topUpOrders/update",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ id, data }: { id: string; data: any }, thunkAPI) => {
    try {
      return await api<TopUpOrder>({
        url: `${topUpUrl}/update/${id}`,
        method: "PUT",
        data,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete top-up order
export const deleteTopUpOrder = createAsyncThunk(
  "topUpOrders/delete",
  async (id: string, thunkAPI) => {
    try {
      return await api<{ message: string }>({
        url: `${topUpUrl}/delete/${id}`,
        method: "DELETE",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const orderTopUpSlice = createSlice({
  name: "topUpOrders",
  initialState,
  reducers: {
    clearTopUpError: (state) => {
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

    // Fetch by ID
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

    // Create
    builder.addCase(createTopUpOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTopUpOrder.fulfilled, (state, action: PayloadAction<TopUpOrder>) => {
      state.loading = false;
      state.topUpOrders.unshift(action.payload);
    });
    builder.addCase(createTopUpOrder.rejected, (state, action) => {
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

export const { clearTopUpError, clearSelectedTopUpOrder } = orderTopUpSlice.actions;
export default orderTopUpSlice.reducer;
