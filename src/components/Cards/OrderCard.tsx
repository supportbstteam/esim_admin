import { Card } from "./Card";
import {
    CheckCircle,
    Clock,
    XCircle,
    Smartphone,
    CreditCard,
    Globe,
    Package,
    Tag,
    AlertTriangle,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OrderCard: React.FC<{ order: any }> = ({ order }) => {
    const statusColor =
        order?.status === "completed"
            ? "bg-green-100 text-green-700"
            : order?.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : order?.status === "failed"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700";

    const activatedColor = order?.activated
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";

    const paymentColor =
        order?.transaction?.status === "success"
            ? "bg-green-100 text-green-700"
            : order?.transaction?.status === "failed"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700";

    const hasEsim = !!order?.esim;
    const isFailedOrder = order?.status === "failed";

    return (
        <Card title="Order Information" contentClassName="space-y-6 text-gray-900">
            {/* Header Section */}
            <div
                className={`p-4 rounded-xl border shadow-sm ${
                    isFailedOrder
                        ? "bg-red-50 border-red-100"
                        : "bg-gradient-to-r from-indigo-50 to-purple-50 border-gray-100"
                }`}
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-gray-800">
                        <Package
                            className={`w-5 h-5 ${
                                isFailedOrder ? "text-red-600" : "text-indigo-600"
                            }`}
                        />
                        <span className="font-semibold">Order ID:</span>
                        <span>{order?.id}</span>
                    </div>
                    <span
                        className={`capitalize px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
                    >
                        {order?.status}
                    </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    Created: {new Date(order?.createdAt).toLocaleString()}
                </p>

                {/* Error message for failed orders */}
                {isFailedOrder && order?.errorMessage && (
                    <div className="mt-3 flex items-start gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-md">
                        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium">{order.errorMessage}</span>
                    </div>
                )}
            </div>

            {/* Plan Info */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-blue-500" /> Plan Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="info-box">
                        <span className="label">Title:</span>
                        <span className="value ml-1"> {order?.plan?.title}</span>
                    </div>
                    <div className="info-box">
                        <span className="label">Data:</span>
                        <span className="value ml-1">{order?.plan?.data}</span>
                    </div>
                    <div className="info-box">
                        <span className="label">Validity:</span>
                        <span className="value ml-1">{order?.plan?.validityDays} days</span>
                    </div>
                    <div className="info-box">
                        <span className="label">Price:</span>
                        <span className="value ml-1">
                            {order?.plan?.currency} {order?.totalAmount}
                        </span>
                    </div>
                </div>
            </div>

            {/* eSIM Info */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-3">
                    <Smartphone className="w-5 h-5 text-purple-500" /> eSIM Details
                </h3>

                {!hasEsim ? (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 flex items-start gap-2">
                        <XCircle className="w-5 h-5 mt-0.5" />
                        <div>
                            <p className="font-semibold">No eSIM linked to this order.</p>
                            {order?.errorMessage && (
                                <p className="text-sm mt-1">{order.errorMessage}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="info-box">
                            <span className="label">SIM Number:</span>
                            <span className="value ml-1">{order?.esim?.simNumber}</span>
                        </div>
                        <div className="info-box">
                            <span className="label">Active:</span>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ml-1 ${
                                    order?.esim?.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {order?.esim?.isActive ? "Yes" : "No"}
                            </span>
                        </div>
                        <div className="info-box">
                            <span className="label">Start Date:</span>
                            <span className="value ml-1">
                                {order?.esim?.startDate
                                    ? new Date(order.esim.startDate).toLocaleDateString()
                                    : "-"}
                            </span>
                        </div>
                        <div className="info-box">
                            <span className="label">End Date:</span>
                            <span className="value ml-1">
                                {order?.esim?.endDate
                                    ? new Date(order.esim.endDate).toLocaleDateString()
                                    : "-"}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Country & Transaction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-3">
                        <Globe className="w-5 h-5 text-green-500" /> Country Info
                    </h3>
                    <div className="info-section">
                        <p>
                            <span className="font-medium">Name:</span> {order?.country?.name}
                        </p>
                        <p>
                            <span className="font-medium">ISO:</span> {order?.country?.isoCode}
                        </p>
                        <p>
                            <span className="font-medium">Phone Code:</span>{" "}
                            {order?.country?.phoneCode}
                        </p>
                        <p>
                            <span className="font-medium">Currency:</span>{" "}
                            {order?.country?.currency}
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-3">
                        <CreditCard className="w-5 h-5 text-teal-500" /> Transaction Info
                    </h3>
                    <div className="info-section">
                        <p>
                            <span className="font-medium">Gateway:</span>{" "}
                            {order?.transaction?.paymentGateway}
                        </p>
                        <p>
                            <span className="font-medium">Transaction ID:</span>{" "}
                            {order?.transaction?.transactionId}
                        </p>
                        <p>
                            <span className="font-medium">Amount:</span>{" "}
                            {order?.transaction?.amount}
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentColor}`}
                            >
                                {order?.transaction?.status}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};
