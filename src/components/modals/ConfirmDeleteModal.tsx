import { Loader2 } from "lucide-react";
import React from "react";

interface ConfirmDeleteModalProps {
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
    operatorName?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    open,
    onClose,
    onConfirm,
    operatorName,
    loading = false
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000000] backdrop-blur-md transition-colors">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Delete Operator</h2>
                <p className="mb-6 text-gray-700">
                    Are you sure you want to delete{" "}
                    <span className="font-bold">{operatorName || "this operator"}</span>?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 cursor-pointer rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2
    ${loading
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 cursor-pointer"
                            }`}
                    >
                        {
                            loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : "Delete"
                        }
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;