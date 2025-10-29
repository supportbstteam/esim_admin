import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export interface Blog {
    id: string;
    title: string;
    image?: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    published: boolean
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
export const fetchBlogs = createAsyncThunk("blogs/fetchAll", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await api({ url: "/admin/blogs", method: "GET" });
    return res.blogs;
});

// 🧩 Create blog
export const createBlog = createAsyncThunk("blogs/create", async (data: { title: string; content: string; image?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await api({ url: "/admin/blogs", method: "POST", data });
    return res.blog;
});

// 🧩 Update blog
export const updateBlog = createAsyncThunk("blogs/update", async ({ id, data }: { id: string; data: Partial<Blog> }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await api({ url: `/admin/blogs/${id}`, method: "PATCH", data });
    return res.blog;
});

// 🧩 Delete blog
export const deleteBlog = createAsyncThunk("blogs/delete", async (id: string) => {
    await api({ url: `/admin/blogs/${id}`, method: "DELETE" });
    return id;
});

const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get all
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
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
