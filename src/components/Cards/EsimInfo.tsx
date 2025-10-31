import React from "react";
import { FiDatabase } from "react-icons/fi";

interface EsimInfoProps {
  countryName: string;
  countryFlagUrl: string;
  planType: string;
  expired: boolean;
  simNo: string;
  purchasedOn: string;
  activationDate: string;
  validityDays: string;
  dataUsed: number;
  dataTotal: number;
  planStart: string;
  planEnd: string;
  price: string;
  onRecharge: () => void;
}

const EsimInfo: React.FC<EsimInfoProps> = ({
  countryName,
  countryFlagUrl,
  planType,
  expired,
  simNo,
  purchasedOn,
  validityDays,
  dataUsed,
  dataTotal,
  price,
}) => {
  const progressPercent = dataTotal ? Math.min(100, (dataUsed / dataTotal) * 100) : 0;

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-md border border-neutral-200 relative">
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">SIM Information</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <img
            src={countryFlagUrl}
            alt={countryName}
            className="w-10 h-10 object-cover rounded-full border border-neutral-300"
          />
          <div>
            <p className="font-semibold text-neutral-900">{countryName}</p>
            <p className="text-neutral-500 text-sm">{planType}</p>
          </div>
        </div>

        {expired && (
          <span className="bg-rose-100 text-rose-600 rounded-full text-xs px-4 py-1 font-semibold">
            Expired
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <p className="text-neutral-400">ICCID No</p>
        <p className="text-neutral-700">{simNo}</p>
        <p className="text-neutral-400">Purchased on</p>
        <p className="text-neutral-700">{purchasedOn}</p>
        <p className="text-neutral-400">Validity Days</p>
        <p className="text-neutral-700">{validityDays} Days</p>
        <p className="text-neutral-400">Price</p>
        <p className="text-neutral-700">{price}</p>
      </div>

      {/* <div className="mt-5">
        <div className="flex items-center text-sm mb-1">
          <FiDatabase className="mr-2 text-neutral-400" />
          <span className="text-neutral-600 mr-2">Data Usage</span>
          <span className="text-neutral-500 ml-auto">
            {dataUsed} GB / {dataTotal} GB
          </span>
        </div>
        <div className="h-2 bg-neutral-100 rounded overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div> */}
    </div>
  );
};

export default EsimInfo;
