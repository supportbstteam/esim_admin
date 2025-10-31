"use client";
import TopUpOrdersTable from "@/components/tables/TopUpOrderTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTopUpOrders } from "@/store/slice/topupOrderSlice";
import React, { useEffect } from "react";

function TopUpOrder() {
  const dispatch = useAppDispatch();
  const { topUpOrders, loading } = useAppSelector((state) => state.topupOrders);

  useEffect(() => {
    dispatch(fetchTopUpOrders());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl  font-bold text-black mb-4">Top-Up Orders</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <TopUpOrdersTable topUpOrders={topUpOrders || []} />
      )}
    </div>
  );
}

export default TopUpOrder;
