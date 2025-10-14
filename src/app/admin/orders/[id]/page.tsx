"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrderById } from "@/store/slice/orderSlice";
import { UserCard } from "@/components/Cards/UserCard";
import { OrderCard } from "@/components/Cards/OrderCard";

type Order = {
    id: string;
    totalAmount: string | number;
    status: string;
    activated: boolean;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    plan: {
        title: string;
        validityDays: number;
        price: string;
        currency: string;
    };
    // add other fields as needed
};

export default function OrderDetails() {
    const { order, loading, error } = useAppSelector((state) => state?.orders);
    const dispatch = useAppDispatch();
    const { id } = useParams();

    //   console.log("----")
    const fetchOrderDetails = async () => {
        console.log("--- api calling ---")
        await dispatch(fetchOrderById(id.toString()));
    }



    useEffect(() => {
        if (id)
            fetchOrderDetails();
    }, [dispatch]);

    console.log("---- order details ----", order);
    // console.log("---- order in details page ----", searchParams);
    return (
        <div className="p-4 w-full mx-auto">
            <h1 className="text-3xl font-bold text-black mb-4">Order Details</h1>

            {order?.user && <UserCard user={order?.user} />}
            {order && <OrderCard order={order} />}
        </div>
    );
}
