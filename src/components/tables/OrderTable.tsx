import React from "react";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orders: any;
    onDeleteOrder: (id: string) => void;
};

const OrderTable: React.FC<Props> = ({ orders, onDeleteOrder }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white text-gray-800">
                <thead className="bg-[#16325d] text-white">
                    <tr>
                        <th className="px-6 py-3">Order ID</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Plan</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Activated</th>
                        <th className="px-6 py-3">Created At</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        // console.log("---- order in the map -----", order);
                        return(
                        <tr
                            key={order.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                        >
                            <td className="px-6 py-4 text-sm">
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {order.id.slice(0, 8)}...
                                </Link>
                            </td>
                            <td className="px-6 py-4">
                                {order.user.firstName} {order.user.lastName}
                                <div className="text-xs text-gray-500">{order.user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                {order.plan.title} ({order.plan.validityDays} days)
                            </td>
                            <td className="px-6 py-4">
                                {order.plan.price} {order.plan.currency}
                            </td>
                            <td className="px-6 py-4 capitalize">{order.status}</td>
                            <td className="px-6 py-4">
                                {order.activated ? (
                                    <span className="text-green-600 font-semibold">Yes</span>
                                ) : (
                                    <span className="text-red-600">No</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {new Date(order.createdAt).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    onClick={() => onDeleteOrder(order.id)}
                                    aria-label="Delete Order"
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <FaTrash size={18} />
                                </button>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
