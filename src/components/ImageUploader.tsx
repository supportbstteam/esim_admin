// src/components/UploadImage.tsx
"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
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
  onChange: (url: string) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ label = "Upload Image", value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(10);

    // simulate progress animation
    const fakeProgress = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "<YOUR_UPLOAD_PRESET>");
      formData.append("cloud_name", "<YOUR_CLOUD_NAME>");

      const res = await fetch(`https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setProgress(100);
        clearInterval(fakeProgress);
        setTimeout(() => {
          onChange(data.secure_url);
          toast.success("Image uploaded successfully");
          setUploading(false);
          setProgress(0);
        }, 500);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
      clearInterval(fakeProgress);
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    onChange("");
    toast("Image removed");
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold text-gray-700">{label}</label>}

      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all duration-300
          ${uploading ? "border-blue-400 bg-blue-50" : value ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"}
        `}
      >
        {/* No image - upload state */}
        {!value && !uploading && (
          <div className="text-center flex flex-col items-center gap-2">
            <FaCloudUploadAlt className="text-5xl text-gray-400" />
            <p className="text-gray-600 text-sm">Click or drag image to upload</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}

        {/* Uploading state */}
        {uploading && (
          <div className="flex flex-col items-center justify-center gap-3">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <p className="text-blue-600 font-medium">Uploading... {progress}%</p>
            <div className="w-40 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Uploaded image preview */}
        {value && !uploading && (
          <AnimatePresence>
            <motion.div
              key={value}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <img
                src={value}
                alt="Uploaded Preview"
                className="w-28 h-28 object-cover rounded-xl border shadow-md"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-3 -right-3 bg-red-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700"
                aria-label="Remove image"
              >
                <FaTrashAlt size={12} />
              </button>
              {/* Success icon overlay */}
              <div className="absolute -bottom-3 right-0 bg-green-500 text-white rounded-full p-1 shadow-md">
                <FaCheckCircle size={14} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Empty state (placeholder icon below field for subtle balance) */}
      {!uploading && !value && (
        <div className="flex justify-center text-gray-400 text-xs mt-1 gap-1 items-center">
          <FaImage /> Supported formats: JPG, PNG, WEBP
        </div>
      )}
    </div>
  );
};

export default UploadImage;
