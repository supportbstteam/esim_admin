import { api } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ContentState {
    contents: Record<string, string>; // { about: "...", privacy: "...", terms: "..." }
    loading: boolean;
    error: string | null;
}

const initialState: ContentState = {
    contents: {},
    loading: false,
    error: null,
};

// Fetch content by page
export const fetchContent = createAsyncThunk<{ page: string; html: string }, string>(
    "content/fetchContent",
    async (page, thunkAPI) => {
        try {
            const res = await api<{ page: string; html: string }>({
                url: `/admin/content/${page}`,
                method: "GET",
            });
            return res;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Save content
export const saveContentThunk = createAsyncThunk<{ page: string; html: string }, { page: string; html: string }>(
    "content/saveContent",
    async ({ page, html }, thunkAPI) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res:any = await api<{ page: string; html: string }, { page: string; html: string }>({
                url: "/admin/content",
                method: "POST",
                data: { page, html },
            });
            return res.content;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContent.fulfilled, (state, action: PayloadAction<{ page: string; html: string }>) => {
                state.loading = false;
                state.contents[action.payload.page] = action.payload.html;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .addCase(fetchContent.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Save
            .addCase(saveContentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveContentThunk.fulfilled, (state, action: PayloadAction<{ page: string; html: string }>) => {
                state.loading = false;
                state.contents[action.payload.page] = action.payload.html;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .addCase(saveContentThunk.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default contentSlice.reducer;
