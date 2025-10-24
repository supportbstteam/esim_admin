import { api } from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Types
interface User {
  id: string;
  name: string;
  username: string;
  notificationMail: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? Cookies.get("token") || null : null,
  isAuthenticated: !!(typeof window !== "undefined" && Cookies.get("token")),
  isLoading: false,
  error: null,
};

// 🔹 Logout thunk
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    // Clear cookies & storage
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

// 🔹 Check auth thunk
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("token"); // ✅ Correct cookie usage
    if (!token) throw new Error("No token found");

    // console.log("--- token ---", token);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api({
      method: "GET",
      url: "/admin/details",
      headers: { Authorization: `Bearer ${token}` }, // ✅ attach token
    });

    // console.log("----- response in the user details ----", response);

    return { user: response, token };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Auth check failed");
  }
});

// 🔹 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // CheckAuth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token; // ✅ store token
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false; // ✅ reset
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
