import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// -------------------- TYPES --------------------

export type QueryStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Query {
    id: string;
    queryId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    status: QueryStatus;
    createdAt: string;
    updatedAt: string;
}

interface QueryState {
    queries: Query[];
    selectedQuery: Query | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: QueryState = {
    queries: [],
    selectedQuery: null,
    loading: false,
    error: null,
    success: false,
};

// -------------------- ASYNC THUNKS --------------------

// 1️⃣ Fetch all queries
export const getAllQueries = createAsyncThunk(
    "adminQueries/getAll",
    async (_, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api<Query[]>({
                url: "/admin/query/all-queries",
                method: "GET",
            });
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 2️⃣ Get single query by ID
export const getQueryById = createAsyncThunk(
    "adminQueries/getById",
    async (queryId: string, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api<Query>({
                url: `/admin/query/${queryId}`,
                method: "GET",
            });

            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 3️⃣ Update query status
export const changeQueryStatus = createAsyncThunk(
    "adminQueries/changeStatus",
    async (
        { id, status }: { id: string; status: QueryStatus },
        { rejectWithValue }
    ) => {

        // console.log("---- queryId in change status ----",id);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `/admin/query/${id}/status`,
                method: "PATCH",
                data: { status },
            });
            // console.log("---- res ----",res);

            if (res?.message === "Query status updated successfully")
                toast.success("Query Updated Successfully")

            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 4️⃣ Delete query permanently
export const deleteQuery = createAsyncThunk(
    "adminQueries/delete",
    async (queryId: string, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `/admin/query/${queryId}`,
                method: "DELETE",
            });

            if (res?.message === "Query permanently deleted")
                toast.success("Query permanently deleted")

            return queryId;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// -------------------- SLICE --------------------
const adminQuerySlice = createSlice({
    name: "adminQueries",
    initialState,
    reducers: {
        clearSelectedQuery: (state) => {
            state.selectedQuery = null;
        },
        resetQueryState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // ---- Get All ----
        builder
            .addCase(getAllQueries.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getAllQueries.fulfilled, (state, action) => {
                state.loading = false;
                state.queries = action.payload;
            })
            .addCase(getAllQueries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ---- Get by ID ----
        builder
            .addCase(getQueryById.fulfilled, (state, action) => {
                state.selectedQuery = action.payload;
            })
            .addCase(getQueryById.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // ---- Change Status ----
        builder
            .addCase(changeQueryStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(changeQueryStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const updated = action.payload;
                const index = state.queries.findIndex((q) => q.queryId === updated.queryId);
                if (index !== -1) {
                    state.queries[index] = updated;
                }
                if (state.selectedQuery?.queryId === updated.queryId) {
                    state.selectedQuery = updated;
                }
            })
            .addCase(changeQueryStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ---- Delete ----
        builder
            .addCase(deleteQuery.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.queries = state.queries.filter(
                    (q) => q.queryId !== action.payload
                );
            })
            .addCase(deleteQuery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedQuery, resetQueryState } = adminQuerySlice.actions;
export default adminQuerySlice.reducer;
