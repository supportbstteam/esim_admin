"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import "swiper/css";
import "swiper/css/navigation";
import { useAppDispatch, useAppSelector } from "@/store";

import EsimInfo from "@/components/Cards/EsimInfo";
import { ActivateCard } from "@/components/Cards/EsimScanner";
import OrderSummary from "@/components/Cards/OrderSummaryCard";
import RechargeHistory from "@/components/tables/RechargeHistory";
import { fetchTopUpOrderById } from "@/store/slice/topupOrderSlice";
import PageHeader from "@/components/common/PageHeader";
import CustomerInfo from "@/components/Cards/CustomerInfo";

function TopUpOrderDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { topUpOrder, loading } = useAppSelector((state) => state?.topupOrders);
  const [activeSimIndex, setActiveSimIndex] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchTopUpOrderById(id as string));
  }, [id, dispatch]);


  // console.log("----- console.log ----", topUpOrder);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!topUpOrder || !topUpOrder.esims?.length)
    return <p className="text-center py-10 text-gray-500">No eSIM details found.</p>;

  const activeSim = topUpOrder.esims[activeSimIndex];
  const currencySymbol = activeSim?.currency === "USD" ? "$" : activeSim?.currency || "";

  // console.log("---- top up order -----", topUpOrder);

  return (
    <div className=" mx-auto px-4 md:px-10 py-6">
      {/* ✅ eSIM Carousel Section */}
      <PageHeader
        title="Top Up Details"
        addButtonText="+ Add Testimonial"
        showAddButton={false}
        addButtonRoute="/admin/testimonials/manage?mode=create"
      />

      <CustomerInfo
        name={topUpOrder?.name}
        email={topUpOrder?.email}
        phone={topUpOrder?.phone}
      />
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        topUpOrder.esims.map((esim: any, index: number) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 mt-8 items-start">
            <div className="md:col-span-2 ">
              <EsimInfo
                countryName={esim?.country?.name || topUpOrder?.country?.name || "Unknown"}
                countryFlagUrl={`https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/${(esim?.country?.isoCode || "us").toLowerCase()}.svg`}
                planType={esim?.productName?.replace(/-$/, "") || "N/A"}
                expired={false}
                simNo={esim?.iccid || "N/A"}
                purchasedOn={moment(esim?.createdAt).format("DD/MM/YYYY")}
                activationDate={moment(esim?.startDate).format("DD/MM/YYYY")}
                validityDays={String(esim?.validityDays || 0)}
                dataUsed={0}
                dataTotal={esim?.dataAmount || 0}
                price={`${currencySymbol} ${esim?.price || "0.00"}`}
                planStart={moment(esim?.startDate).format("DD/MM/YYYY")}
                planEnd={moment(esim?.endDate).format("DD/MM/YYYY")}
                onRecharge={() => alert("Recharge clicked!")}
              />
            </div>

            <div className="md:col-span-1 flex justify-center">
              <ActivateCard qrValue={esim?.qrCodeUrl} code={esim?.qrCodeUrl} />
            </div>
          </div>
        ))}

      {/* ✅ Recharge History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 mt-8 items-start">
        <div className="md:col-span-2">
          {activeSim?.topUps?.length ? (
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
          )}
        </div>

        {/* ✅ Order Summary */}
        <div className="md:col-span-1 flex justify-center">
          <OrderSummary
            orderId={topUpOrder?.orderCode}
            transactionId={topUpOrder?.transaction?.transactionId}
            orderDate={moment(topUpOrder?.esims[0]?.createdAt).format("DD/MM/YYYY")}
            totalAmount={`${currencySymbol} ${topUpOrder?.totalAmount || "0.00"}`}
            paymentMethod={topUpOrder?.transaction?.paymentGateway?.toUpperCase() || "N/A"}
          />
        </div>
      </div>
    </div>
  );
}

export default TopUpOrderDetails;
