import { api } from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// -----------------------
// ASYNC THUNKS
// -----------------------

// Create new user
export const createAdminUser = createAsyncThunk(
    "adminUser/create",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (userData: any, { rejectWithValue }) => {
        try {
            const res = await api({
                url: "/admin/users/create-user",
                method: "POST",
                data: userData,
            });

            // console.log("---- repsonse in the creating the user ----", res);
            return res?.user;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response || err.message);
        }
    }
);

// Create new user
export const updateAdminUser = createAsyncThunk(
    "adminUser/update",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (userData: any, { rejectWithValue }) => {
        try {
            const res = await api({
                url: `/admin/users/${userData?.id}/update`,
                method: "PUT",
                data: userData,
            });

            // console.log("---- repsonse in the creating the user ----", res);
            return res?.user;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response || err.message);
        }
    }
);

// export const updateAdminUser 

// Get all users
export const getAllAdminUsers = createAsyncThunk(
    "adminUser/getAll",
    async (_, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: "/admin/users",
                method: "GET",
            });

            // console.log("---- response in the getall admin user ----", res);
            return res?.users;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response || err.message);
        }
    }
);

// Get user details by ID
export const getAdminUserById = createAsyncThunk(
    "adminUser/getById",
    async (id: string, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `/admin/users/${id}`,
                method: "GET",
            });
            return res?.users;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response || err.message);
        }
    }
);

// Block user
export const blockAdminUser = createAsyncThunk(
    "adminUser/block",
    async (id: string, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `/admin/users/${id}/block`,
                method: "PATCH",
            });
            toast.success(res?.message);

            // console.log("----- response in the block user ----", res);
            return res;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("---- error in the block customer by admin ---", err);
            return rejectWithValue(err.response || err.message);
        }
    }
);

// Soft delete user
export const deleteAdminUser = createAsyncThunk(
    "adminUser/delete",
    async (id: string, { rejectWithValue }) => {

        // console.log("---- admin user delete process ----", id);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `/admin/users/${id}/delete`,
                method: "DELETE",
            });
            return { id, ...res };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response || err.message);
        }
    }
);

// Filter users by country & plan
export const filterAdminUsers = createAsyncThunk(
    "adminUser/filter",
    async (filters: { countryId?: string; planId?: string }, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `/admin/users/filter`,
                method: "GET",
                params: filters,
            });

            return res?.users;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response || err.message);
        }
    }
);

// -----------------------
// SLICE
// -----------------------
interface AdminUserState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customer: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedUser: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: AdminUserState = {
    customer: [],
    selectedUser: null,
    loading: false,
    error: null,
};

const adminUserSlice = createSlice({
    name: "adminUser",
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // create user
            .addCase(createAdminUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAdminUser.fulfilled, (state, action) => {
                state.loading = false;
                state.customer.push(action.payload);
            })
            .addCase(createAdminUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // create user
            .addCase(updateAdminUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAdminUser.fulfilled, (state, action) => {
                state.loading = false;
                state.customer.push(action.payload);
            })
            .addCase(updateAdminUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // get all users
            .addCase(getAllAdminUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllAdminUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.customer = action.payload;
            })
            .addCase(getAllAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // get user details
            .addCase(getAdminUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdminUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload.data;
            })
            .addCase(getAdminUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // block user
            .addCase(blockAdminUser.fulfilled, (state, action) => {
                const userIndex = state.customer.findIndex((u) => u.id === action.payload.id);
                if (userIndex !== -1) {
                    state.customer[userIndex] = { ...state.customer[userIndex], ...action.payload };
                }
            })

            // delete user
            .addCase(deleteAdminUser.fulfilled, (state, action) => {
                const userIndex = state.customer.findIndex((u) => u.id === action.payload.id);
                if (userIndex !== -1) {
                    state.customer[userIndex] = { ...state.customer[userIndex], ...action.payload };
                }
            })

            // filter users
            .addCase(filterAdminUsers.fulfilled, (state, action) => {
                state.customer = action.payload;
            });
    },
});

export const { clearSelectedUser, clearError } = adminUserSlice.actions;

export default adminUserSlice.reducer;
