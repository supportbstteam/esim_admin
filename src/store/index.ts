import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import themeReducer from "./slice/themeSlice";  // Example slice
import userReducer from "./slice/userSlice"
import eSimReducer from "./slice/eSimSlice"
export const store = configureStore({
  reducer: {
    theme: themeReducer,  // Add other slices here
    user: userReducer,
    esim: eSimReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hook to use dispatch with TypeScript
export const useAppDispatch: () => AppDispatch = useDispatch;
