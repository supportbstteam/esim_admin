import { api } from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ===========================
// Async Thunks
// ===========================

// Create testimonial
export const createTestimonial = createAsyncThunk(
  "testimonials/create",
  async (data: { name: string; profession?: string; content: string }, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({ url: "/admin/testimonials", method: "POST", data });
      return res.data.testimonial;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create testimonial");
    }
  }
);

// Get all testimonials
export const getAllTestimonials = createAsyncThunk(
  "testimonials/getAll",
  async (_, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({ url: "/admin/testimonials", method: "GET" });
      return res.data.testimonials;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch testimonials");
    }
  }
);

// Get single testimonial
export const getTestimonialById = createAsyncThunk(
  "testimonials/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({ url: `/admin/testimonials/${id}`, method: "GET" });
      return res.data.testimonial;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch testimonial");
    }
  }
);

// Update testimonial
export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({ url: `/admin/testimonials/${id}`, method: "PUT", data });
      return res.data.testimonial;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update testimonial");
    }
  }
);

// Delete testimonial
export const deleteTestimonial = createAsyncThunk(
  "testimonials/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api({ url: `/admin/testimonials/${id}`, method: "DELETE" });
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete testimonial");
    }
  }
);

// ===========================
// Slice
// ===========================
interface TestimonialState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testimonials: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  current: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestimonialState = {
  testimonials: [],
  current: null,
  loading: false,
  error: null,
};

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials.unshift(action.payload);
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get All
    builder
      .addCase(getAllTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(getAllTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get by ID
    builder
      .addCase(getTestimonialById.fulfilled, (state, action) => {
        state.current = action.payload;
      });

    // Update
    builder
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = state.testimonials.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete
    builder
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.filter((t) => t.id !== action.payload);
      });
  },
});

export default testimonialSlice.reducer;
