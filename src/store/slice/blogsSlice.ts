import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export interface Blog {
  id: string;
  title: string;
  image?: string;
  content: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

interface BlogState {
  blogs: Blog[];
  blog?: Blog;
  loading: boolean;
  error?: string;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
};

// 🧩 Get all blogs
export const fetchBlogs = createAsyncThunk("blogs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await api({ url: "/admin/blogs", method: "GET" });
    return res.blogs;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to fetch blogs");
    return rejectWithValue(err.message);
  }
});

// 🧩 Create blog
export const createBlog = createAsyncThunk(
  "blogs/create",
  async (data: { title: string; content: string; image?: string, summary:string }, { rejectWithValue }) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({ url: "/admin/blogs", method: "POST", data });
      // toast.success("Blog created successfully");
      return res.blog;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create blog");
      return rejectWithValue(err.message);
    }
  }
);

// 🧩 Update blog
export const updateBlog = createAsyncThunk(
  "blogs/update",
  async ({ id, data }: { id: string; data: Partial<Blog> }, { rejectWithValue }) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api({ url: `/admin/blogs/${id}`, method: "PATCH", data });
      // toast.success("Blog updated successfully");
      return res.blog;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update blog");
      return rejectWithValue(err.message);
    }
  }
);

// 🧩 Delete blog
export const deleteBlog = createAsyncThunk("blogs/delete", async (id: string, { rejectWithValue }) => {
  try {
    await api({ url: `/admin/blogs/${id}`, method: "DELETE" });
    toast.success("Blog deleted successfully");
    return id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to delete blog");
    return rejectWithValue(err.message);
  }
});

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.blogs.unshift(action.payload);
      })

      // Update
      .addCase(updateBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        const idx = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.blogs[idx] = action.payload;
      })

      // Delete
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
