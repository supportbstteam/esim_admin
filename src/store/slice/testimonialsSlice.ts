
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export interface Testimonial {
  id: string;
  name: string;
  profession?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TestimonialState {
  testimonials: Testimonial[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testimonial: any;
  loading: boolean;
  error: string | null;
}

const initialState: TestimonialState = {
  testimonials: [],
  testimonial: null,
  loading: false,
  error: null,
};

// ✅ Get all testimonials
export const getAllTestimonials = createAsyncThunk(
  "testimonials/getAll",
  async (_, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({
        url: `/admin/testimonials`,
        method: "GET",
      });
      return res.testimonials || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch testimonials");
    }
  }
);

// ✅ Get testimonial by ID
export const getTestimonialById = createAsyncThunk(
  "testimonials/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({
        url: `/admin/testimonials/${id}`,
        method: "GET",
      });
      return res.testimonial;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch testimonial");
    }
  }
);

// ✅ Create testimonial
export const createTestimonial = createAsyncThunk(
  "testimonials/create",
  async (data: { name: string; profession?: string; content: string, active:boolean }, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({
        url: `/admin/testimonials`,
        method: "POST",
        data,
      });
      toast.success("Testimonial created successfully");
      return res.testimonial;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create testimonial");
      return rejectWithValue(err?.response?.data?.message || "Failed to create testimonial");
    }
  }
);

// ✅ Update testimonial
export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async ({ id, data }: { id: string; data: Partial<Testimonial> }, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({
        url: `/admin/testimonials/${id}`,
        method: "PUT",
        data,
      });
      toast.success("Testimonial updated successfully");
      return res.testimonial;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update testimonial");
      return rejectWithValue(err?.response?.data?.message || "Failed to update testimonial");
    }
  }
);

// ✅ Delete testimonial
export const deleteTestimonial = createAsyncThunk(
  "testimonials/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api({
        url: `/admin/testimonials/${id}`,
        method: "DELETE",
      });
      toast.success("Testimonial deleted successfully");
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete testimonial");
      return rejectWithValue(err?.response?.data?.message || "Failed to delete testimonial");
    }
  }
);

// ✅ Toggle Active/Inactive
export const updateTestimonialStatus = createAsyncThunk(
  "testimonials/updateStatus",
  async ({ id, isActive }: { id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({
        url: `/admin/testimonials/${id}/status`,
        method: "PATCH",
        data: { isActive },
      });
      toast.success(`Testimonial ${isActive ? "activated" : "deactivated"} successfully`);
      return res.testimonial;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update testimonial status");
      return rejectWithValue(err?.response?.data?.message || "Failed to update testimonial status");
    }
  }
);

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearTestimonial: (state) => {
      state.testimonial = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get All
      .addCase(getAllTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(getAllTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTestimonialStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonialStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.testimonials.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.testimonials[index] = action.payload;
        }
      })
      .addCase(updateTestimonialStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ✅ Get By ID
      .addCase(getTestimonialById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTestimonialById.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonial = action.payload;
      })
      .addCase(getTestimonialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Create
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
      })

      // ✅ Update
      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.testimonials.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.testimonials[index] = action.payload;
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Delete
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTestimonial } = testimonialSlice.actions;
export default testimonialSlice.reducer;
