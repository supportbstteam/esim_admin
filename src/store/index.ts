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
import customerSlice from "./slice/adminUserSlice"
import contactSlice from "./slice/contactSlice"
import socialSlice from "./slice/socialSlice"
import contentSlice from "./slice/contentSlice"
import orderSlice from "./slice/orderSlice"
import topUpOrderSlice from "./slice/topUpOrderSlice"
import blogSlice from "./slice/blogsSlice"
import querySlice from "./slice/querySlice"

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
    topup: topupSlice,
    customer: customerSlice,
    query: querySlice,
    contacts: contactSlice,
    socials: socialSlice,
    contents: contentSlice,
    orders: orderSlice,
    topUpOrders: topUpOrderSlice,
    blogs: blogSlice
  },
});

// 🔹 Infer the root state and dispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🔹 Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
