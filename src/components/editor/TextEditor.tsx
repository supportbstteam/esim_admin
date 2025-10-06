"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAllContent, fetchContent, saveContentThunk } from "@/store/slice/contentSlice";

import type { EditorProps } from "react-draft-wysiwyg";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";

const Editor = dynamic<EditorProps>(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
);

interface ContentEditorProps {
    page: string; // e.g., "about", "privacy", "other"
}

export default function ContentEditor({ page }: ContentEditorProps) {
    const dispatch = useAppDispatch();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [initialized, setInitialized] = useState(false);
    const [title, setTitle] = useState('');

    const html = useAppSelector(
        (state) => state.contents.contents[page] || ""
    );
    const loading = useAppSelector((state) => state.contents.loading);
    const error = useAppSelector((state) => state.contents.error);

    // Fetch content automatically when route (page) changes
    useEffect(() => {
        if (page && !initialized) {
            dispatch(fetchContent(page));
            setInitialized(true);
        }
    }, [dispatch, page, initialized]);

    // Update editor when HTML changes
    useEffect(() => {
        if (html) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(
                    contentBlock.contentBlocks
                );
                setEditorState(EditorState.createWithContent(contentState));
            }
        } else {
            setEditorState(EditorState.createEmpty());
        }
    }, [html]);

    const handleSave = async () => {
        const rawContent = convertToRaw(editorState.getCurrentContent());
        const html = draftToHtml(rawContent);

        // console.log("---- page and html -----", { page, html });
        // return;

        try {
            const response = await dispatch(saveContentThunk({ page: title, html }));

            if (saveContentThunk.fulfilled.match(response)) {
                toast.success(
                    <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-600 text-xl" />
                        <span>{page.toUpperCase()} page updated successfully!</span>
                    </div>,
                    {
                        style: {
                            background: "#dcfce7",
                            color: "#166534",
                            border: "1px solid #22c55e",
                        },
                    }
                );
                await dispatch(fetchAllContent());
            }

            else if (saveContentThunk.rejected.match(response)) {
                const message =
                    typeof response.payload === "string"
                        ? response.payload
                        : "Failed to save content.";
                toast.error(
                    <div className="flex items-center gap-2">
                        <FiXCircle className="text-red-600 text-xl" />
                        <span>{message}</span>
                    </div>,
                    {
                        style: {
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "1px solid #f87171",
                        },
                    }
                );
                await dispatch(fetchAllContent());
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unexpected error occurred.";
            toast.error(
                <div className="flex items-center gap-2">
                    <FiAlertTriangle className="text-yellow-600 text-xl" />
                    <span>{message}</span>
                </div>,
                {
                    style: {
                        background: "#fef3c7",
                        color: "#92400e",
                        border: "1px solid #fbbf24",
                    },
                }
            );
        }
    };


    return (
        <div className="p-6 max-w-full mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-[#16325d] capitalize">
                {page === "other" ? "Add New CMS Page" : `${page} Page Editor`}
            </h1>

            {/* Only show input if it's "other" */}
            {page === "other" && (
                <div className="mb-4">
                    <label className="block font-semibold mb-1 text-[#16325d]">
                        New Page Key (e.g., refund, disclaimer):
                    </label>
                    <input
                        type="text"
                        placeholder="Enter page key..."
                        className="border border-gray-300 rounded p-2 w-full text-black"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
            )}

            {/* Editor */}
            <Editor
                editorState={editorState}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class border text-black border-gray-300 p-4 min-h-[400px]"
                onEditorStateChange={setEditorState}
            />

            <button
                onClick={handleSave}
                className="bg-[#37c74f] hover:bg-[#28a23a] text-black font-semibold px-4 py-2 rounded mt-4"
            >
                {loading ? "Saving..." : "Save Content"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {html && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-xl font-semibold mb-2">Preview:</h2>
                    <div
                        className="prose max-w-full"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>
            )}
        </div>
    );
}
