import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

const baseUrl = "/admin/faq";

/* ---------------------- THUNKS ---------------------- */

// ✅ Get all FAQs
export const getAllFaqs = createAsyncThunk("faq/getAll", async (_, { rejectWithValue }) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res:any = await api({ url: baseUrl, method: "GET" });
        // console.log("----fa ys  sda ----",res);
        return res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return rejectWithValue(err?.response?.data?.message || err.message);
    }
});

// ✅ Get single FAQ by ID
export const getFaqById = createAsyncThunk("faq/getById", async (id: string, { rejectWithValue }) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res:any = await api({ url: `${baseUrl}/${id}`, method: "GET" });
        // console.log("----- res ----",res);
        return res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return rejectWithValue(err?.response?.data?.message || err.message);
    }
});

// ✅ Create FAQ(s)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFaq = createAsyncThunk("faq/create", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api({ url: baseUrl, method: "POST", data });
        return res.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return rejectWithValue(err?.response?.data?.message || err.message);
    }
});

// ✅ Update FAQ
export const updateFaq = createAsyncThunk(
    "faq/update",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const res = await api({ url: `${baseUrl}/${id}`, method: "PUT", data });
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err.message);
        }
    }
);

// ✅ Update FAQ Status
export const updateFaqStatus = createAsyncThunk(
    "faq/updateStatus",
    async ({ id, isActive }: { id: string; isActive: boolean }, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res:any = await api({ url: `${baseUrl}/${id}/status`, method: "PATCH", data: { isActive } });
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err.message);
        }
    }
);

// ✅ Delete FAQ
export const deleteFaq = createAsyncThunk("faq/delete", async (id: string, { rejectWithValue }) => {
    try {
        await api({ url: `${baseUrl}/${id}`, method: "DELETE" });
        return id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return rejectWithValue(err?.response?.data?.message || err.message);
    }
});

/* ---------------------- SLICE ---------------------- */

interface FaqState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    faqs: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    faq: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: FaqState = {
    faqs: [],
    faq: null,
    loading: false,
    error: null,
};

const faqSlice = createSlice({
    name: "faq",
    initialState,
    reducers: {
        clearFaqError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------------- Get All ---------------- */
            .addCase(getAllFaqs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllFaqs.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = action.payload || [];
            })
            .addCase(getAllFaqs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* ---------------- Get by ID ---------------- */
            .addCase(getFaqById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFaqById.fulfilled, (state, action) => {
                state.loading = false;
                state.faq = action.payload;
            })
            .addCase(getFaqById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* ---------------- Create ---------------- */
            .addCase(createFaq.pending, (state) => {
                state.loading = true;
            })
            .addCase(createFaq.fulfilled, (state, action) => {
                state.loading = false;
                const newData = Array.isArray(action.payload?.data)
                    ? action.payload.data
                    : [action.payload?.data || action.payload];
                state.faqs.push(...newData);
            })
            .addCase(createFaq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* ---------------- Update ---------------- */
            .addCase(updateFaq.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateFaq.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload?.data || action.payload;
                if (updated) {
                    const index = state.faqs.findIndex((f) => f.id === updated.id);
                    if (index >= 0) state.faqs[index] = updated;
                }
            })
            .addCase(updateFaq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* ---------------- Update Status ---------------- */
            .addCase(updateFaqStatus.fulfilled, (state, action) => {
                const updated = action.payload?.data || action.payload;
                if (updated) {
                    const index = state.faqs.findIndex((f) => f.id === updated.id);
                    if (index >= 0) state.faqs[index] = updated;
                }
            })

            /* ---------------- Delete ---------------- */
            .addCase(deleteFaq.fulfilled, (state, action) => {
                state.faqs = state.faqs.filter((f) => f.id !== action.payload);
            });
    },
});

export const { clearFaqError } = faqSlice.actions;
export default faqSlice.reducer;
