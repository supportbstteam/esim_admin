"use client";
import React, { useState } from "react";
import {
  FaCloudUploadAlt,
  FaTrashAlt,
  FaCheckCircle,
  FaSpinner,
  FaImage,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface UploadImageProps {
  label?: string;
  value?: string;
  onChange: (file: File | null) => void;
}

const UploadImageRaw: React.FC<UploadImageProps> = ({
  label = "Upload Image",
  value,
  onChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setUploading(true);
    setProgress(10);

    // fake progress UI
    const timer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p));
    }, 120);

    setTimeout(() => {
      clearInterval(timer);
      setUploading(false);
      setProgress(100);

      onChange(file); // ✅ return file to parent

      setTimeout(() => setProgress(0), 400);
    }, 500);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all duration-300
        ${
          uploading
            ? "border-blue-400 bg-blue-50"
            : preview
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-blue-400 bg-gray-50"
        }`}
      >
        {!preview && !uploading && (
          <div className="text-center flex flex-col items-center gap-2">
            <FaCloudUploadAlt className="text-5xl text-gray-400" />
            <p className="text-gray-600 text-sm">
              Click or drag image to upload
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}

        {uploading && (
          <div className="flex flex-col items-center gap-3">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <p className="text-blue-600 font-medium">
              Uploading... {progress}%
            </p>

            <div className="w-40 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {preview && !uploading && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <img
                src={preview}
                className="w-28 h-28 object-cover rounded-xl border shadow-md"
              />

              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-3 -right-3 bg-red-600 text-white p-2 rounded-full"
              >
                <FaTrashAlt size={12} />
              </button>

              <div className="absolute -bottom-3 right-0 bg-green-500 text-white rounded-full p-1">
                <FaCheckCircle size={14} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!uploading && !preview && (
        <div className="flex justify-center text-gray-400 text-xs mt-1 gap-1 items-center">
          <FaImage /> Supported formats: JPG, PNG, WEBP
        </div>
      )}
    </div>
  );
};

export default UploadImageRaw;