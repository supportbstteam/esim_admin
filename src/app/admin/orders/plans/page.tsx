"use client";

import React, { useEffect } from "react";
import OrderTable from "@/components/tables/OrderTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrders } from "@/store/slice/orderSlice";
import PageHeader from "@/components/common/PageHeader";
import CommonTableSkeleton from "@/components/skeletons/CommonTableSkeleton";

function Orders() {
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector((state) => state?.orders || { orders: [], loading: false });

    // console.log("=----- orders ------", orders);

    useEffect(() => {
        const fetchOrder = async () => {
            await dispatch(fetchOrders());
        };
        fetchOrder();
    }, [dispatch]);

    // console.log("--- orders ---", orders);

    return (
        <div className="p-4">
            <PageHeader
                title="Orders"
                showAddButton={false}
                showBackButton={false}
            // addButtonText="+ Add CMS"
            // addButtonRoute={`/admin/cms/other`}
            />

            {
                loading ? (
                    <CommonTableSkeleton
                        columns={7}
                        rows={10}
                        showSearch={true}
                    />
                ) : (
                    <OrderTable
                        orders={orders}
                        onDeleteOrder={async () => {
                            await dispatch(fetchOrders());
                        }}
                    />
                )
            }

            {/* {orders && orders.length > 0 ? (
            ) : (
                <p className="text-gray-500">No orders found.</p>
            )} */}
        </div>
    );
}

export default Orders;
