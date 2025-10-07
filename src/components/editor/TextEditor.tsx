"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchContent, fetchAllContent, saveContentThunk } from "@/store/slice/contentSlice";
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
    const content = useAppSelector((state) => state.contents.contents[page]);
    const loading = useAppSelector((state) => state.contents.loading);
    const error = useAppSelector((state) => state.contents.error);

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState(page !== "other" ? content?.title || page : "");
    const [initialized, setInitialized] = useState(false);

    // Fetch content on page change
    useEffect(() => {
        if (page && !initialized && page !== "other") {
            dispatch(fetchContent(page));
            setInitialized(true);
        }
    }, [dispatch, page, initialized]);

    // Update editor when content.html changes
    useEffect(() => {
        if (content?.html) {
            const blocks = htmlToDraft(content.html);
            if (blocks) {
                const contentState = ContentState.createFromBlockArray(blocks.contentBlocks);
                setEditorState(EditorState.createWithContent(contentState));
                if (page !== "other") setTitle(content.title || page);
            }
        } else {
            setEditorState(EditorState.createEmpty());
        }
    }, [content, page]);

    const handleSave = async () => {
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        if (!title) {
            toast.error("Please enter a title for the page.");
            return;
        }

        try {
            const response = await dispatch(saveContentThunk({ page: title.split(" ")[0].toLowerCase(), html, title }));

            if (saveContentThunk.fulfilled.match(response)) {
                toast.success(
                    <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-600 text-xl" />
                        <span>{title} saved successfully!</span>
                    </div>
                );
                dispatch(fetchAllContent());
            } else if (saveContentThunk.rejected.match(response)) {
                const message = typeof response.payload === "string" ? response.payload : "Failed to save content.";
                toast.error(
                    <div className="flex items-center gap-2">
                        <FiXCircle className="text-red-600 text-xl" />
                        <span>{message}</span>
                    </div>
                );
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unexpected error occurred.";
            toast.error(
                <div className="flex items-center gap-2">
                    <FiAlertTriangle className="text-yellow-600 text-xl" />
                    <span>{message}</span>
                </div>
            );
        }
    };

    return (
        <div className="p-6 max-w-full mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-[#16325d] capitalize">
                {page === "other" ? "Add New CMS Page" : `${title}`}
            </h1>

            {/* Input for "other" page */}
            {page === "other" && (
                <div className="mb-4">
                    <label className="block font-semibold mb-1 text-[#16325d]">Page Key (e.g., refund, disclaimer):</label>
                    <input
                        type="text"
                        placeholder="Enter page key..."
                        className="border border-gray-300 rounded p-2 w-full text-black"
                        value={title}
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
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Content"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {content?.html && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-xl font-semibold mb-2 text-black">Preview:</h2>
                    <div className="prose max-w-full text-[#494949]" dangerouslySetInnerHTML={{ __html: content.html }} />
                </div>
            )}
        </div>
    );
}
