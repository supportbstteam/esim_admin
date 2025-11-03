"use client";

import React, { useEffect } from "react";
import OrderTable from "@/components/tables/OrderTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrders } from "@/store/slice/orderSlice";
import PageHeader from "@/components/common/PageHeader";

function Orders() {
    const dispatch = useAppDispatch();
    const { orders } = useAppSelector((state) => state?.orders || { orders: [] });

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
                <OrderTable
                    orders={orders}
                    onDeleteOrder={async () => {
                        await dispatch(fetchOrders());
                    }}
                />
            {/* {orders && orders.length > 0 ? (
            ) : (
                <p className="text-gray-500">No orders found.</p>
            )} */}
        </div>
    );
}

export default Orders;
