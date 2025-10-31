import React from "react";

interface OrderSummaryProps {
    orderId: string;
    transactionId: string;
    orderDate: string;
    totalAmount: string;
    paymentMethod: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    orderId,
    transactionId,
    orderDate,
    totalAmount,
    paymentMethod,
}) => (
    <div className="w-full bg-white  rounded-xl shadow border border-neutral-100 p-6">
        <h2 className="text-xl font-semibold text-neutral-900  mb-6">
            Order Summary
        </h2>
        <div className="space-y-4 text-sm">
            <div className="flex justify-between">
                <span className="text-neutral-400">Order ID</span>
                <span className="font-medium text-neutral-900 ">
                    {orderId}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-neutral-400">Transaction ID:</span>
                <span className="font-medium text-neutral-700 ">
                    {transactionId}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-neutral-400">Order Date:</span>
                <span className="font-medium text-neutral-700 ">
                    {orderDate}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-neutral-400">Total Amount</span>
                <span className="font-medium text-neutral-900 ">
                    {totalAmount}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-neutral-400">Payment Method:</span>
                <span className="font-medium text-neutral-700 ">
                    {paymentMethod}
                </span>
            </div>
        </div>
    </div>
);

export default OrderSummary;
