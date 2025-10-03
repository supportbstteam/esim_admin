"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { useAppDispatch, useAppSelector } from "@/store";
import { fetchContent, saveContentThunk } from "@/store/slice/contentSlice";

import type { EditorProps } from "react-draft-wysiwyg";

const Editor = dynamic<EditorProps>(
    () => import("react-draft-wysiwyg").then(mod => mod.Editor),
    { ssr: false }
);

interface ContentEditorProps {
    pageKey: string; // "about", "privacy", "terms"
}

export default function ContentEditor({ pageKey }: ContentEditorProps) {
    const dispatch = useAppDispatch();
    const html = useAppSelector(state => state.contents.contents[pageKey] || "");
    const loading = useAppSelector(state => state.contents.loading);
    const error = useAppSelector(state => state.contents.error);

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    // Load page content
    useEffect(() => {
        if (pageKey) dispatch(fetchContent(pageKey));
    }, [dispatch, pageKey]);

    // Convert HTML to editor state
    useEffect(() => {
        if (html) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                setEditorState(EditorState.createWithContent(contentState));
            }
        }
    }, [html]);

    const handleSave = () => {
        const rawContent = convertToRaw(editorState.getCurrentContent());
        const html = draftToHtml(rawContent);
        dispatch(saveContentThunk({ page: pageKey, html }));
    };

    return (
        <div className="p-6 max-w-full mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-[#16325d]">
                {pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} Page Editor
            </h1>

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
