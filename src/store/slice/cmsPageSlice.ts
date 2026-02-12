import { createSlice } from "@reduxjs/toolkit";
// import { createPage } from "../thunks/CmsPageSlice";
import {
    fetchAllPages,
    fetchPageBySlug,
    savePage,
} from "../thunks/CmsPageThunk";

interface CMSPageState {
    page: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pages: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: CMSPageState = {
    page: null,
    sections: [],
    pages: [],            // 🔥 NEW
    loading: false,
    error: null,
    success: false,
};


const cmsPageSlice = createSlice({
    name: "cmsPage",
    initialState,
    reducers: {
        resetCMSState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.page = null;
            state.sections = []
        },
    },
    extraReducers: (builder) => {
  builder

    /* ---------------- SAVE PAGE ---------------- */
    .addCase(savePage.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(savePage.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    })
    .addCase(savePage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    /* ---------------- FETCH SINGLE PAGE ---------------- */
    .addCase(fetchPageBySlug.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchPageBySlug.fulfilled, (state, action) => {
      state.loading = false;
      state.page = action.payload.page;
      state.sections = action.payload.sections;
    })
    .addCase(fetchPageBySlug.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    /* ---------------- FETCH ALL PAGES ---------------- */
    .addCase(fetchAllPages.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllPages.fulfilled, (state, action) => {
      state.loading = false;
      state.pages = action.payload.pages; // 🔥 IMPORTANT
    })
    .addCase(fetchAllPages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
}

});

export const { resetCMSState } = cmsPageSlice.actions;
export default cmsPageSlice.reducer;
