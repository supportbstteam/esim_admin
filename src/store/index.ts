// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import themeReducer from "./slice/themeSlice";
import userReducer from "./slice/userSlice";
import eSimReducer from "./slice/eSimSlice";
import countriesSlice from "./slice/countrySlice";
import operatorSlice from "./slice/operatorSlice";
import thirdPartyAPiSlice from "./slice/ThirdPartyPlanAPi"
import planSlice from "./slice/apiPlanDbSlice"
import thirdTopupSlice from "./slice/ThirdPartyTopupSlice"
import topupSlice from "./slice/apiTopupDbSlice"
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    esim: eSimReducer,
    countries: countriesSlice,
    operator: operatorSlice,
    thirdParty: thirdPartyAPiSlice,
    thirdPartyTopUp: thirdTopupSlice,
    plan: planSlice,
    topup: topupSlice
  },
});

// 🔹 Infer the root state and dispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🔹 Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
