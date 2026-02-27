"use client";
import PageHeader from "@/components/common/PageHeader";
import CommonTableSkeleton from "@/components/skeletons/CommonTableSkeleton";
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
      <PageHeader
        title="Top Up"
        showAddButton={false}
        showBackButton={false}
        addButtonText="+ Add Testimonial"
        addButtonRoute="/admin/testimonials/manage?mode=create"
      />
      {loading ? (
        <CommonTableSkeleton
          columns={7}
          rows={10}
          showSearch={true}
        />
      ) : (
        <TopUpOrdersTable topUpOrders={topUpOrders || []} />
      )}
    </div>
  );
}

export default TopUpOrder;
