"use client";

import React, { useState } from "react";
import { FaTrash, FaSpinner, FaSave } from "react-icons/fa";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { joinUrl } from "@/lib/joinUrl";

interface ImageData {
    name: string;
    size: number;
    type: string;
    url: string;
    fileName?: string;
    filePath?: string;
    width?: number;
    height?: number;
}

interface TempImage {
    base64: string;
    name: string;
    size: number;
    type: string;
    width?: number;
    height?: number;
}

interface UploadImageProps {
    image?: ImageData | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFieldValue: (field: string, value: any) => void;
    name?: string;
    label?: string;
}

export default function UploadImage({
    image,
    setFieldValue,
    name = "image",
    label = "Upload Image",
}: UploadImageProps) {

    const [tempImage, setTempImage] = useState<TempImage | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    // convert to base64 (preview only)
    const convertToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () =>
                resolve(reader.result as string);

            reader.onerror = reject;

        });

    // get dimensions
    const getImageDimensions = (base64: string): Promise<{ width: number; height: number }> =>
        new Promise((resolve) => {

            const img = new Image();

            img.onload = () =>
                resolve({
                    width: img.width,
                    height: img.height,
                });

            img.src = base64;

        });

    // select image
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) return;

        try {

            setSelectedFile(file);

            const base64 = await convertToBase64(file);
            const dimensions = await getImageDimensions(base64);

            setTempImage({
                base64,
                name: file.name,
                size: file.size,
                type: file.type,
                width: dimensions.width,
                height: dimensions.height,
            });

        } catch (err) {
            console.error(err);
            toast.error("Failed to process image");
        }

    };

    // upload to backend
    // const handleSave = async (e: React.MouseEvent) => {

    //     e.preventDefault();
    //     e.stopPropagation();

    //     if (!selectedFile) {
    //         toast.error("No image selected");
    //         return;
    //     }

    //     try {

    //         setSaving(true);

    //         const formData = new FormData();

    //         // MUST match multer field name
    //         formData.append("file", selectedFile);
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         const response: any = await api({
    //             url: "/admin/image/upload",
    //             method: "POST",
    //             data: formData,
    //             headers: {
    //                 "Content-Type": "multipart/form-data",

    //             },
    //         });

    //         const savedImage: ImageData = {

    //             name: response.data.originalName,
    //             size: response.data.size,
    //             type: response.data.mimeType,

    //             fileName: response.data.fileName,
    //             filePath: response.data.filePath,

    //             url:
    //                 `${process.env.NEXT_PUBLIC_API_URL}` +
    //                 response.data.filePath,

    //             width: tempImage?.width,
    //             height: tempImage?.height,

    //         };

    //         // store in Formik
    //         setFieldValue(name, savedImage);

    //         // clear temp state
    //         setTempImage(null);
    //         setSelectedFile(null);

    //         toast.success("Image uploaded successfully");

    //     } catch (err) {

    //         console.error(err);
    //         toast.error("Upload failed");

    //     } finally {

    //         setSaving(false);

    //     }

    // };

    const handleSave = async (e: React.MouseEvent) => {

        e.preventDefault();
        e.stopPropagation();

        if (!selectedFile) {
            toast.error("No image selected");
            return;
        }

        try {

            setSaving(true);

            const formData = new FormData();

            // MUST MATCH backend: single("image")
            formData.append("image", selectedFile);

            const token = Cookies.get("token");

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}admin/image/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data.data;


            // console.log("-=-=--= data -=-=-=-=",data);
            // return;

            const savedImage: ImageData = {
                name: data.originalName,
                size: data.size,
                type: data.mimeType,
                fileName: data.fileName,
                filePath: data.filePath,
                url:
                    joinUrl(
                        process.env.NEXT_PUBLIC_API_URL!,
                        data.filePath
                    ),
                width: tempImage?.width,
                height: tempImage?.height,
            };

            setFieldValue(name, savedImage);

            setTempImage(null);
            setSelectedFile(null);

            toast.success("Image uploaded successfully");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Upload failed"
            );

        } finally {

            setSaving(false);

        }

    };

    const handleRemove = (e: React.MouseEvent) => {

        e.preventDefault();
        e.stopPropagation();

        setTempImage(null);
        setSelectedFile(null);

        setFieldValue(name, null);

    };

    const src =
        tempImage?.base64 ||
        image?.url ||
        null;

    return (

        <div className="rounded-xl border bg-white p-6 space-y-4">

            <label className="text-xs font-bold text-gray-500 uppercase">
                {label}
            </label>

            <label className="relative group flex h-64 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 overflow-hidden">

                {src ? (
                    <>

                        <img
                            src={src}
                            className="h-full w-full object-cover"
                            alt="Preview"
                        />

                        {/* Remove */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute z-50 top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-700"
                        >
                            <FaTrash size={14} />
                        </button>

                        {/* Save */}
                        {tempImage && (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="absolute top-3 z-50 cursor-pointer right-14 bg-green-600 text-white px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-green-700 flex items-center gap-2"
                            >
                                {saving ? (
                                    <FaSpinner className="animate-spin" size={14} />
                                ) : (
                                    <>
                                        <FaSave size={14} />
                                        Save
                                    </>
                                )}
                            </button>
                        )}

                    </>
                ) : (
                    <span className="text-gray-400">
                        Click to upload image
                    </span>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />

            </label>

        </div>

    );

}