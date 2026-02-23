import { api } from "@/lib/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const CMS_BASE_URL = "/api/cms/pages";
const PUBLIC_BASE_URL = "/admin/cms/pages";

/* ---------------- CREATE PAGE ---------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// cmsPage.thunks.ts
export const savePage = createAsyncThunk(
    "cms/savePage",
    async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { page, sections, id }: { page: string; sections: any[], id: string },
        { rejectWithValue }
    ) => {
        // console.log("-=-=- id in the save page -=-=", id);
        // return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `/admin/cms/pages/${page}`,
                method: "PUT", // always PUT
                data: { sections, id },
            });

            if (res.data) {
                toast.success("CMS Uploaded Successfully")
            }
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(
                err?.response?.data?.message || err.message
            );
        }
    }
);

/* ---------------- GET PAGE (PUBLIC) ---------------- */
export const fetchPageBySlug = createAsyncThunk(
    "cms/fetchPage",
    async (page: string, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `${PUBLIC_BASE_URL}/${page}`,
                method: "GET",
            });


            return res;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(
                err?.response?.data?.message || err.message
            );
        }
    }
);

/* ---------------- GET PAGE (PUBLIC) ---------------- */
export const fetchAllPages = createAsyncThunk(
    "cms/fetchAllPages",
    async (_, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await api({
                url: `${PUBLIC_BASE_URL}`,
                method: "GET",
            });

            // console.log("-=-=-=--= response in the fetall pages -=-=--=-=-=", res);
            return res;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(
                err?.response?.data?.message || err.message
            );
        }
    }
);