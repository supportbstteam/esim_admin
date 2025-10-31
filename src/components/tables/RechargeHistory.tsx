import React, { useState } from "react";
import emptySVGPath from "@/app/assets/empty.svg"
import Image from "next/image";
interface RechargeItem {
    purchasedOn: string;
    plan: string;
    planStart: string;
    planEnd: string;
    paymentMode: string;
}

interface RechargeHistoryProps {
    records: RechargeItem[];
    rowsPerPage?: number;
}

const RechargeHistory: React.FC<RechargeHistoryProps> = ({
    records,
    rowsPerPage = 5,
}) => {
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(records.length / rowsPerPage);
    const paginatedData = records.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );


    // ✅ Empty state
    if (records.length === 0) {
        return (
            <div className="bg-white w-full rounded-xl p-6 shadow border border-neutral-100 flex flex-col items-center justify-center min-h-[280px]">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6 w-full text-left">
                    Recharge History
                </h2>
                <Image
                    src={emptySVGPath}
                    alt="No Recharges"
                    width={120}
                    height={120}
                    className="my-6 select-none pointer-events-none opacity-85"
                />
                <div className="text-neutral-400 text-base font-medium mt-2">
                    No Recharge Yet
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white  rounded-xl p-6 shadow border border-neutral-100 ">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-neutral-900 ">
                    Recharge History
                </h2>
                <div className="flex gap-2">
                    <button
                        className="text-gray-900 px-2 py-1 rounded font-medium hover:underline disabled:opacity-40"
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <button
                        className="text-gray-700  px-2 py-1 rounded font-medium hover:underline disabled:opacity-40"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 ">
                            <th className="text-left font-normal text-neutral-400 py-2 px-2">Purchased on</th>
                            <th className="text-left font-normal text-neutral-400 py-2 px-2">Plan</th>
                            <th className="text-left font-normal text-neutral-400 py-2 px-2">Plan start date</th>
                            {/* <th className="text-left font-normal text-neutral-400 py-2 px-2">Plan end date</th> */}
                            <th className="text-left font-normal text-neutral-400 py-2 px-2">Payment Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, idx) => {
                            // console.log("---- top up order ----", row)
                            return(
                            <tr
                                key={row.purchasedOn + row.plan}
                                className={idx % 2 === 1 ? "bg-neutral-50 " : ""}
                            >
                                <td className="py-2 px-2 text-neutral-700 ">{row.purchasedOn}</td>
                                <td className="py-2 px-2 text-neutral-700 ">{row.plan}</td>
                                <td className="py-2 px-2 text-neutral-700 ">{row.planStart}</td>
                                {/* <td className="py-2 px-2 text-neutral-700 ">{row.planEnd}</td> */}
                                <td className="py-2 px-2 text-neutral-700 ">{row.paymentMode}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RechargeHistory;
