import React from "react";

interface ConfirmDeleteModalProps {
  isDeleted: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username?: string;
}

const CustomerDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  isDeleted,
  onClose,
  onConfirm,
  username,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90vw] max-w-sm border">
        <h2 className="text-xl font-semibold text-[#16325d] mb-2">
          Confirm Delete
        </h2>
        <p className="text-gray-700 mb-4">
          Are you sure you want to {!isDeleted ? "delete" : "remove from delete"}
          {username && <span className="font-semibold">&nbsp;{username}</span>}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 cursor-pointer rounded ${!isDeleted ? "bg-red-600" : "bg-green-600"} text-white ${!isDeleted ? "hover:bg-red-700" : "hover:bg-green-700"}`}
          >
            Yes, {!isDeleted ? "Delete" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDeleteModal;
