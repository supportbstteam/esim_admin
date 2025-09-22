"use client";
import React, { useEffect } from "react";
import { PlansFormModal } from "@/components/modals/PlanModal";
import { useAppDispatch, useAppSelector } from "@/store";
import { getOperators } from "@/store/slice/operatorSlice";

function Plans() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user?.id) {
      // dispatch(getOperators({ page: 1, limit: 20 })); // ✅ pass pagination defaults
      dispatch(getOperators()); // ✅ pass pagination defaults
    }
  }, [user?.id, dispatch]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Plans</h1>
      {/* <PlansFormModal /> */}
    </div>
  );
}

export default Plans;
