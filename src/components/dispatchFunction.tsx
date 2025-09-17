import { useAppDispatch } from "@/store";
import { fetchCountries } from "@/store/slice/countrySlice";
import { fetchESims } from "@/store/slice/eSimSlice";

// hooks/useActions.ts

// import { useAppDispatch } from "@/redux/store";
// import { fetchESims } from "@/redux/slice/eSimSlice";
// import { fetchClubs } from "@/redux/slice/clubSlice";
// import { fetchOffers } from "@/redux/slice/offerSlice";

export const useActions = () => {
    const dispatch = useAppDispatch();

    return {
        fetchESims: () => dispatch(fetchESims()),
        fetchCount: () => dispatch(fetchCountries()),
    };
};
