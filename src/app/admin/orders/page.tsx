"use client";

import React, { useEffect } from "react";
import OrderTable from "@/components/tables/OrderTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrders } from "@/store/slice/orderSlice";

function Orders() {
    const dispatch = useAppDispatch();
    const { orders } = useAppSelector((state) => state?.orders || { orders: [] });

    useEffect(() => {
        const fetchOrder = async () => {
            await dispatch(fetchOrders());
        };
        fetchOrder();
    }, [dispatch]);

    // console.log("--- orders ---", orders);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-black mb-4">Orders</h1>
            {orders && orders.length > 0 ? (
                <OrderTable
                    orders={orders}
                    onDeleteOrder={(orderId) => {
                        console.log("---- delete orderId ----", orderId);
                        // Add your delete logic here
                    }}
                />
            ) : (
                <p className="text-gray-500">No orders found.</p>
            )}
        </div>
    );
}

export default Orders;
