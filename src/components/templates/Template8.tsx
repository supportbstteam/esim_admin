"use client";

import { Formik } from "formik";
import dynamic from "next/dynamic";
import FormikSync from "@/lib/formikSync";
import { useCMS } from "../useCMS";

// Dynamically import your specific RichTextEditor component
const RichTextEditor = dynamic(() => import("../common/RichTextEditor"), {
    ssr: false,
    loading: () => (
        <div className="p-8 border border-dashed border-gray-200 rounded-lg text-center text-gray-400">
            Loading Editor...
        </div>
    )
});

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    section: any;
}

export default function Template8({ section }: Props) {
    const { updateSection } = useCMS();

    const initialContent = section.data?.content || "<h2>New Section</h2><p>Start writing here...</p>";

    return (
        <Formik
            enableReinitialize
            initialValues={{ content: initialContent }}
            onSubmit={() => { }}
        >
            {({ values, setFieldValue }) => (
                <form className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <FormikSync onChange={(vals) => updateSection(section.id, vals)} />

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                            Page Content
                        </label>

                        <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
                            {/* Use the dynamically loaded RichTextEditor */}
                            <RichTextEditor
                                value={values.content}
                                onChange={(val) => setFieldValue("content", val)}
                            />
                        </div>

                        <p className="text-[10px] text-gray-400 italic">
                            All changes are saved automatically.
                        </p>
                    </div>
                </form>
            )}
        </Formik>
    );
}
