import { useCallback } from "react";
import { fetchCountries } from "@/store/slice/countrySlice";
import { fetchESims } from "@/store/slice/eSimSlice";
import { useAppDispatch } from "@/store";

const useDispatchFunction = () => {
  const dispatch = useAppDispatch();

  // useCallback to memoize the function
  const loadData = useCallback(async () => {
    try {
      // Dispatch multiple async thunks
      await dispatch(fetchCountries());
      await dispatch(fetchESims());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch]);

  return { loadData };
};

export default useDispatchFunction;
