import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { FiCopy, FiDownload } from "react-icons/fi";
import * as htmlToImage from 'html-to-image';

interface ActivateCardProps {
    qrValue: string;
    code: string;
}

export const ActivateCard: React.FC<ActivateCardProps> = ({ qrValue, code }) => {
    const qrRef = useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleDownload = async () => {
        if (qrRef.current) {
            const dataUrl = await htmlToImage.toPng(qrRef.current);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = "qr-code.png";
            link.click();
        }
    };

    return (
        <div className="w-full mx-auto rounded-lg shadow border border-neutral-100 bg-white p-6 flex flex-col items-center">
            <div ref={qrRef} className="mb-4 bg-white p-2 rounded">
                <QRCode value={qrValue} size={128} />
            </div>
            <h2 className="text-lg font-semibold text-center mb-2 text-neutral-900 ">
                Scan QR Code to Activate
            </h2>
            <div className="flex items-center mb-4 bg-neutral-100  rounded px-3 py-2">
                <span className="font-mono text-sm text-neutral-700 ">{code}</span>
                <button className="ml-2 p-1 hover:bg-neutral-200  rounded" onClick={handleCopy}>
                    <FiCopy className="w-5 h-5 text-neutral-500" />
                </button>
            </div>
            <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-neutral-50  hover:bg-neutral-100  border-neutral-200  text-neutral-800 transition"
                onClick={handleDownload}
            >
                <FiDownload className="h-5 w-5" />
                Download QR Code
            </button>
        </div>
    );
};
