"use client";

import React, { useState } from "react";
import { Formik } from "formik";
import { useAppDispatch } from "@/store";
import { updateImage } from "@/store/slice/mediaSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { FaTrash, FaSpinner } from "react-icons/fa";
import { joinUrl } from "@/lib/joinUrl";
import PageHeader from "../common/PageHeader";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    isEdit?: boolean;
}

export default function MediaForm({ initialData, isEdit }: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const convertToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow border">
            <Formik
                enableReinitialize
                initialValues={{
                    name: initialData?.name || "",
                }}
                onSubmit={async (values) => {
                    try {
                        setSaving(true);

                        let uploadedImage = initialData;

                        // 🟢 If new file selected → upload first
                        if (selectedFile) {
                            const formData = new FormData();
                            formData.append("image", selectedFile);
                            formData.append("name", values.name);

                            const token = Cookies.get("token");

                            const response = await axios.post(
                                `${process.env.NEXT_PUBLIC_API_URL}admin/images/upload`,
                                formData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );

                            uploadedImage = response.data.data;
                        }

                        // 🟢 Update DB metadata (name)
                        // if (isEdit && initialData?.id) {
                        //     await dispatch(
                        //         updateImage({
                        //             id: initialData.id,
                        //             data: { name: values.name },
                        //         })
                        //     ).unwrap();
                        // }

                        toast.success("Image saved successfully!");
                        router.push("/admin/media");
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (err: any) {
                        toast.error(
                            err.response?.data?.message ||
                            "Something went wrong"
                        );
                    } finally {
                        setSaving(false);
                    }
                }}
            >
                {({ values, handleChange, handleSubmit }) => {
                    const previewSrc =
                        preview ||
                        (initialData?.filePath
                            ? joinUrl(
                                process.env.NEXT_PUBLIC_API_URL!,
                                initialData.filePath
                            )
                            : null);

                    const handleFileChange = async (
                        e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setSelectedFile(file);

                        const base64 = await convertToBase64(file);
                        setPreview(base64);
                    };

                    const handleRemove = () => {
                        setPreview(null);
                        setSelectedFile(null);
                    };

                    return (
                        <div>
                            <PageHeader
                                title={isEdit ? "Edit Media" : "Add Media"}
                                showAddButton={false}
                            />
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                {/* <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        {isEdit ? "Edit Media" : "Add Media"}
                                    </h2>
                                    
                                </div> */}


                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Enter image name"
                                    />
                                </div>

                                {/* Upload Area */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Media Image
                                    </label>

                                    <div className="relative group h-72 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden hover:border-gray-400 transition">

                                        {previewSrc ? (
                                            <>
                                                <img
                                                    src={previewSrc}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={handleRemove}
                                                    className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">
                                                Click to upload image
                                            </span>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    {saving && (
                                        <FaSpinner className="animate-spin" size={14} />
                                    )}
                                    {isEdit ? "Update Image" : "Save Image"}
                                </button>
                            </form>
                        </div>
                    );
                }}
            </Formik>
        </div>
    );
}