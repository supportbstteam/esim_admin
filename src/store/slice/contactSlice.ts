"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// ----------------- Types -----------------
export interface Contact {
    id: string;
    type: string;      // "Phone" | "Email"
    value: string;     // actual phone/email
    position?: string; // optional (Sales, Support, etc.)
}

export type CreateContactDto = Omit<Contact, "id">;
export type UpdateContactDto = Partial<Omit<Contact, "id">> & { id: string };

// ----------------- Thunks -----------------
export const getContacts = createAsyncThunk<Contact[]>(
    "contacts/getAll",
    async () => {
        return await api<Contact[]>({
            url: "admin/contact",
            method: "GET",
        });
    }
);

export const createContacts = createAsyncThunk<Contact[], CreateContactDto[]>(
    "contacts/create",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
        return await api<Contact[]>({
            url: "admin/contact/create",
            method: "POST",
            data,
        });
    }
);

export const updateContact = createAsyncThunk<Contact, UpdateContactDto>(
    "contacts/update",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ id, ...data }: any) => {
        return await api<Contact>({
            url: `admin/contact/update/${id}`,
            method: "PUT",
            data,
        });
    }
);

export const deleteContact = createAsyncThunk<{ id: string }, string>(
    "contacts/delete",
    async (id) => {
        await api<void>({
            url: `admin/contact/delete/${id}`,
            method: "DELETE",
        });
        return { id };
    }
);

// ----------------- Slice -----------------
interface ContactState {
    items: Contact[];
    loading: boolean;
    error: string | null;
}

const initialState: ContactState = {
    items: [],
    loading: false,
    error: null,
};

const contactSlice = createSlice({
    name: "contacts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // GET
        builder.addCase(getContacts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
            state.loading = false;
            state.items = action.payload;
        });
        builder.addCase(getContacts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch contacts";
        });

        // CREATE
        builder.addCase(createContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
            state.items.push(...action.payload);
        });

        // UPDATE
        builder.addCase(updateContact.fulfilled, (state, action: PayloadAction<Contact>) => {
            const idx = state.items.findIndex((c) => c.id === action.payload.id);
            if (idx !== -1) state.items[idx] = action.payload;
        });

        // DELETE
        builder.addCase(deleteContact.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
            state.items = state.items.filter((c) => c.id !== action.payload.id);
        });
    },
});

export default contactSlice.reducer;
