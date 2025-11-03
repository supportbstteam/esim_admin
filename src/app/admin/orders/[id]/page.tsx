"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearSelectedOrder, fetchOrderById } from "@/store/slice/orderSlice";
import { UserCard } from "@/components/Cards/UserCard";
import { OrderCard } from "@/components/Cards/OrderCard";
import PageHeader from "@/components/common/PageHeader";
import EsimInfo from "@/components/Cards/EsimInfo";
import { ActivateCard } from "@/components/Cards/EsimScanner";
import RechargeHistory from "@/components/tables/RechargeHistory";
import moment from "moment";
import OrderSummary from "@/components/Cards/OrderSummaryCard";

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
        // console.log("--- api calling ---")
        // await dispatch()
        await dispatch(clearSelectedOrder());
        await dispatch(fetchOrderById(id.toString()));
    }



    useEffect(() => {
        if (id)
            fetchOrderDetails();
    }, [dispatch]);

    console.log("---- order details ----", order);

    return (
        <div className=" mx-auto px-4 md:px-10 py-6">
            {/* ✅ eSIM Carousel Section */}
            <PageHeader
                title="Order Details"
                showAddButton={false}
            />

            {order?.status?.toLowerCase() === "failed" && (
                <div className="flex w-full items-center justify-center my-6">
                    <div className="bg-red-100 flex-1 w-full border border-red-300 text-red-800 px-6 py-4 rounded-2xl shadow-md w-full max-w-2xl text-center">
                        <h2 className="text-2xl font-bold mb-2">
                            Order Failed 🚫
                        </h2>
                        <p className="text-lg font-medium">
                            <span className="font-semibold">
                                {order?.customer?.firstName} {order?.customer?.lastName}
                            </span>
                            ’s order could not be completed.
                        </p>
                        {order?.errorMessage && (
                            <p className="mt-2 text-sm italic text-red-700">
                                Reason: {order.errorMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {order?.status?.toLowerCase() === "partial" && (
                <div className="flex items-center justify-center my-6">
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-2xl shadow-md w-full max-w-2xl text-center">
                        <h2 className="text-2xl font-bold mb-2">
                            Partial Completion ⚠️
                        </h2>
                        <p className="text-lg font-medium">
                            The order for{" "}
                            <span className="font-semibold">
                                {order?.customer?.firstName} {order?.customer?.lastName}
                            </span>{" "}
                            was only partially completed.
                        </p>
                        {order?.errorMessage && (
                            <p className="mt-2 text-sm italic text-yellow-700">
                                Some eSIMs could not be created: {order.errorMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                order?.esims && order?.esims.map((esim: any, index: number) => {
                    console.log("---- esim ----",esim);
                    return(
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 mt-8 items-start">
                        <div className="md:col-span-2 ">
                            <EsimInfo
                                countryName={esim?.country?.name || order?.country?.name || "Unknown"}
                                countryFlagUrl={`https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/${(esim?.country?.isoCode || "us").toLowerCase()}.svg`}
                                planType={esim?.productName?.replace(/-$/, "") || "N/A"}
                                expired={false}
                                simNo={esim?.iccid || "N/A"}
                                purchasedOn={moment(esim?.createdAt).format("MMM Do YY")}
                                activationDate={moment(esim?.startDate).format("MMM Do YY")}
                                validityDays={String(esim?.validityDays || 0)}
                                dataUsed={0}
                                dataTotal={esim?.dataAmount || 0}
                                price={`${order?.country?.currency} ${esim?.price || "0.00"}`}
                                planStart={moment(esim?.startDate).format("MMM Do YY")}
                                planEnd={moment(esim?.endDate).format("MMM Do YY")}
                                onRecharge={() => alert("Recharge clicked!")}
                            />
                        </div>

                        <div className="md:col-span-1 flex justify-center">
                            <ActivateCard qrValue={esim?.qrCodeUrl || ""} code={esim?.qrCodeUrl || ""} />
                        </div>
                    </div>
                )})
            }




            {/* ✅ Recharge History */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 mt-8 items-start">
                <div className="md:col-span-2">
                    {/* {activeSim?.topUps?.length ? (
            <RechargeHistory
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              records={activeSim.topUps.map((t: any) => ({
                purchasedOn: moment(t.createdAt).format("DD/MM/YYYY"),
                plan: (t.title || t.name || "Unknown Plan").replace(/-/g, " "),
                planStart: moment(activeSim.startDate).format("DD/MM/YYYY"),
                planEnd: moment(activeSim.endDate).format("DD/MM/YYYY"),
                paymentMode: "Online",
              }))}
              rowsPerPage={5}
            />
          ) : (
            <p className="text-sm text-gray-500">No recharge history available.</p>
          )} */}
                </div>

                {/* ✅ Order Summary */}
                <div className="md:col-span-1 flex justify-center">
                    <OrderSummary
                        orderId={order?.orderCode}
                        transactionId={order?.transaction?.transactionId}
                        orderDate={moment(order?.esims[0]?.createdAt).format("MMM Do YY")}
                        totalAmount={` ${order?.totalAmount || "0.00"}`}
                        paymentMethod={order?.transaction?.paymentGateway?.toUpperCase() || "N/A"}
                    />
                </div>
            </div>
        </div>
    );
}
