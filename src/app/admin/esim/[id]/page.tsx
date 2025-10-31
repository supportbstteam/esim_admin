"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useAppDispatch, useAppSelector } from "@/store";

import EsimInfo from "@/components/Cards/EsimInfo";
import { ActivateCard } from "@/components/Cards/EsimScanner";
import OrderSummary from "@/components/Cards/OrderSummaryCard";
import RechargeHistory from "@/components/tables/RechargeHistory";
import { fetchESimDetails } from "@/store/slice/eSimSlice";

function ESimDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { eSimDetails, loading } = useAppSelector((state) => state.esim);
  const [activeSimIndex, setActiveSimIndex] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchESimDetails(id as string));
  }, [id, dispatch]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!eSimDetails || !eSimDetails.esims?.length)
    return <p className="text-center py-10 text-gray-500">No eSIM details found.</p>;

  const activeSim = eSimDetails.esims[activeSimIndex];
  const currencySymbol = activeSim?.currency === "USD" ? "$" : activeSim?.currency || "";

  return (
    <div className=" mx-auto px-4 md:px-10 py-6">
      {/* ✅ eSIM Carousel Section */}
      <label className="text-black text-2xl font-semibold" >E-SIM Details</label>
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            eSimDetails.esims.map((esim: any, index: number) => (
              <SwiperSlide key={index}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 mt-8 items-start">
                  <div className="md:col-span-2 mx-10">
                    <EsimInfo
                      countryName={esim?.country?.name || eSimDetails?.country?.name || "Unknown"}
                      countryFlagUrl={`https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/${(esim?.country?.isoCode || "us").toLowerCase()}.svg`}
                      planType={esim?.productName?.replace(/-$/, "") || "N/A"}
                      expired={false}
                      simNo={esim?.iccid || "N/A"}
                      purchasedOn={moment(esim?.createdAt).format("MMM Do YY")}
                      activationDate={moment(esim?.startDate).format("MMM Do YY")}
                      validityDays={String(esim?.validityDays || 0)}
                      dataUsed={0}
                      dataTotal={esim?.dataAmount || 0}
                      price={`${currencySymbol} ${esim?.price || "0.00"}`}
                      planStart={moment(esim?.startDate).format("MMM Do YY")}
                      planEnd={moment(esim?.endDate).format("MMM Do YY")}
                      onRecharge={() => alert("Recharge clicked!")}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-center">
                    <ActivateCard qrValue={esim?.qrCodeUrl} code={esim?.qrCodeUrl} />
                  </div>
                </div>
              </SwiperSlide>
            ))}

      {/* ✅ Recharge History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 mt-8 items-start">
        <div className="md:col-span-2 mx-10">
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
            orderId={eSimDetails?.orderCode}
            transactionId={eSimDetails?.transaction?.transactionId}
            orderDate={moment(eSimDetails?.esims[0]?.createdAt).format("MMM Do YY")}
            totalAmount={`${currencySymbol} ${eSimDetails?.totalAmount || "0.00"}`}
            paymentMethod={eSimDetails?.transaction?.paymentGateway?.toUpperCase() || "N/A"}
          />
        </div>
      </div>
    </div>
  );
}

export default ESimDetails;
