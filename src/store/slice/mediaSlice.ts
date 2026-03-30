import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import { clear } from "console";

export interface ImageType {
  id: number;
  name?: string;
  originalName: string;
  filePath: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface MediaState {
  images: ImageType[];
  image: ImageType | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: MediaState = {
  images: [],
  image: null,
  pagination: null,
  loading: false,
  error: null,
};

export const fetchImages = createAsyncThunk(
  "media/fetchImages",
  async (params: any, { rejectWithValue }) => {
    try {
      return await api({
        url: "/admin/images",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50,
          search: params?.search || "",
        },
      });
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const fetchImageById = createAsyncThunk(
  "media/fetchImageById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await api({
        url: `/admin/images/${id}`,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateImage = createAsyncThunk(
  "media/updateImage",
  async (
    { id, data }: { id: number; data: Partial<ImageType> },
    { rejectWithValue },
  ) => {
    try {
      return await api({
        url: `/admin/images/${id}`,
        method: "PUT",
        data,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const deleteImage = createAsyncThunk(
  "media/deleteImage",
  async (id: number, { rejectWithValue }) => {
    try {
      await api({
        url: `/admin/images/${id}`,
        method: "DELETE",
      });
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    clearMediaState(state) {
      state.images = [];
      state.image = null;
      state.pagination = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch all
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchImages.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.images = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchImageById.fulfilled, (state: any, action) => {
        state.image = action.payload;
      })

      // Update
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(updateImage.fulfilled, (state, action: PayloadAction<any>) => {
        const updated = action.payload.data;
        state.images = state.images.map((img) =>
          img.id === updated.id ? updated : img,
        );
        state.image = updated;
      })

      // Delete
      .addCase(
        deleteImage.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.images = state.images.filter(
            (img) => img.id !== action.payload,
          );
        },
      );
  },
});

export const { clearMediaState } = mediaSlice.actions;
export default mediaSlice.reducer;
