"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// ----------------- Types -----------------
export interface Social {
    id: string;
    type: string; // "Facebook" | "Twitter" | "LinkedIn" etc.
    link: string; // URL
}

export type CreateSocialDto = Omit<Social, "id">;
export type UpdateSocialDto = Partial<Omit<Social, "id">> & { id: string };

// ----------------- Thunks -----------------
export const getSocials = createAsyncThunk<Social[]>(
    "socials/getAll",
    async () => {
        return await api<Social[]>({
            url: "admin/social-media",
            method: "GET",
        });
    }
);

export const createSocials = createAsyncThunk<Social[], CreateSocialDto[]>(
    "socials/create",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
        return await api<Social[]>({
            url: "admin/social-media/create",
            method: "POST",
            data,
        });
    }
);

export const updateSocial = createAsyncThunk<Social, UpdateSocialDto>(
    "socials/update",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ id, ...data }: any) => {
        return await api<Social>({
            url: `admin/social-media/update/${id}`,
            method: "PUT",
            data,
        });
    }
);

export const deleteSocial = createAsyncThunk<{ id: string }, string>(
    "socials/delete",
    async (id) => {
        await api<void>({
            url: `admin/social-media/delete/${id}`,
            method: "DELETE",
        });
        return { id };
    }
);

// ----------------- Slice -----------------
interface SocialState {
    items: Social[];
    loading: boolean;
    error: string | null;
}

const initialState: SocialState = {
    items: [],
    loading: false,
    error: null,
};

const socialSlice = createSlice({
    name: "socials",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // GET
        builder.addCase(getSocials.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getSocials.fulfilled, (state, action: PayloadAction<Social[]>) => {
            state.loading = false;
            state.items = action.payload;
        });
        builder.addCase(getSocials.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch socials";
        });

        // CREATE
        builder.addCase(createSocials.fulfilled, (state, action: PayloadAction<Social[]>) => {
            state.items.push(...action.payload);
        });

        // UPDATE
        builder.addCase(updateSocial.fulfilled, (state, action: PayloadAction<Social>) => {
            const idx = state.items.findIndex((s) => s.id === action.payload.id);
            if (idx !== -1) state.items[idx] = action.payload;
        });

        // DELETE
        builder.addCase(deleteSocial.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
            state.items = state.items.filter((s) => s.id !== action.payload.id);
        });
    },
});

export default socialSlice.reducer;
