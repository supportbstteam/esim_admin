"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@ckeditor/ckeditor5-core";

interface Props {
    value: string;
    onChange: (data: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [CKEditorComponent, setCKEditorComponent] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ClassicEditorBuild, setClassicEditorBuild] = useState<any>(null);

    useEffect(() => {
        const loadEditor = async () => {
            const { CKEditor } = await import("@ckeditor/ckeditor5-react");
            const ClassicEditor = (await import(
                "@ckeditor/ckeditor5-build-classic"
            )).default;

            setCKEditorComponent(() => CKEditor);
            setClassicEditorBuild(() => ClassicEditor);
        };

        loadEditor();
    }, []);

    if (!CKEditorComponent || !ClassicEditorBuild) {
        return (
            <div className="border border-gray-300 rounded p-4">
                Loading editor...
            </div>
        );
    }

    return (
        <CKEditorComponent
            editor={ClassicEditorBuild}
            data={value || ""}
            config={{
                toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "undo",
                    "redo",
                ],
                heading: {
                    options: [
                        {
                            model: "paragraph",
                            title: "Paragraph",
                            class: "ck-heading_paragraph",
                        },
                        {
                            model: "heading1",
                            view: "h1",
                            title: "Heading 1",
                            class: "ck-heading_heading1",
                        },
                        {
                            model: "heading2",
                            view: "h2",
                            title: "Heading 2",
                            class: "ck-heading_heading2",
                        },
                        {
                            model: "heading3",
                            view: "h3",
                            title: "Heading 3",
                            class: "ck-heading_heading3",
                        },
                    ],
                },
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(_: any, editor: Editor) => {
                const html = editor.getData();
                onChange(html);
            }}
        />
    );
}
