"use client";

import PageHeader from "@/components/common/PageHeader";
import PageInput from "@/components/modals/PageSelector";
import Template1Preview from "@/components/templates/previews/TemplatePreview1";
import Template2Preview from "@/components/templates/previews/TemplatePreview2";
import Template3Preview from "@/components/templates/previews/TemplatePreview3";
import Template4Preview from "@/components/templates/previews/TemplatePreview4";
import Template5Preview from "@/components/templates/previews/TemplatePreview5";
import Template6Preview from "@/components/templates/previews/TemplatePreview6";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";
import Template4 from "@/components/templates/Template4";
import Template5 from "@/components/templates/Template5";
import Template6 from "@/components/templates/Template6";
import { CMSProvider, useCMS } from "@/components/useCMS";
import { useAppDispatch, useAppSelector } from "@/store";
import { savePage } from "@/store/thunks/CmsPageThunk";
import { handleImageUploadForSection } from "@/utils/handleTemplate6";
import { useRouter } from "next/navigation";
import React from "react";
import { FiTrash2 } from "react-icons/fi";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Renderer = () => {
    const router = useRouter();
    const { sections, removeSection } = useCMS();

    if (!sections.length) {
        return (
            <div className="text-center py-20 text-gray-400">
                Add templates to start building the page
            </div>
        );
    }

    return (
        <div className="space-y-16 px-6 py-10">
            {sections.map((section) => (
                <div
                    key={section.id}
                    className="relative border rounded-lg group bg-white"
                >
                    {/* 🗑 DELETE ICON */}
                    <button
                        onClick={() => removeSection(section.id)}
                        className="
                            absolute top-3 right-3 z-10
                            p-2 rounded-full
                            text-gray-400 hover:text-red-600
                            hover:bg-red-50
                            opacity-0 group-hover:opacity-100
                            transition
                            cursor-pointer
                        "
                        title="Delete template"
                    >
                        <FiTrash2 size={18} />
                    </button>

                    {/* TEMPLATE RENDER */}
                    {section.template === "template1" && (
                        <Template1 section={section} />
                    )}
                    {section.template === "template2" && (
                        <Template2 section={section} />
                    )}
                    {section.template === "template3" && (
                        <Template3 section={section} />
                    )}

                    {section.template === "template4" && (
                        <Template4 section={section} />
                    )}

                    {section.template === "template5" && (
                        <Template5 section={section} />
                    )}

                    {section.template === "template6" && (
                        <Template6 section={section} />
                    )}
                </div>
            ))}
        </div>
    );
};

const SaveAll = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { sections, page } = useCMS();

    const saveAll = async () => {
        try {
            const processedSections = [];

            for (const section of sections) {
                // Templates that may contain images
                if (
                    section.template === "template2" ||
                    section.template === "template3" ||
                    section.template === "template6"
                ) {
                    const updated = await handleImageUploadForSection(section);

                    processedSections.push({
                        template: updated.template,
                        data: updated.data,
                    });
                } else {
                    processedSections.push({
                        template: section.template,
                        data: section.data,
                    });
                }
            }

            dispatch(
                savePage({
                    page,
                    sections: processedSections,
                })
            );
            router.back();
        } catch (err) {
            console.error("Save failed:", err);
        }
    };


    return (
        <div className="flex justify-end px-6 py-10">
            <button
                onClick={saveAll}
                className="bg-green-500 text-white px-8 py-3 rounded-lg cursor-pointer font-semibold"
            >
                Save All Templates
            </button>
        </div>
    );
};


const CreateCMSInner = () => {
    const dispatch = useAppDispatch();
    const { page, sections, loading } = useAppSelector(
        (state) => state.cmsPages
    );

    const { hydrate } = useCMS();

    // 🔒 hydration guard
    const hydratedRef = React.useRef(false);

    React.useEffect(() => {
        if (
            !hydratedRef.current &&
            page &&
            sections &&
            sections.length > 0
        ) {
            hydrate(page, sections);
            hydratedRef.current = true; // ✅ prevent loop
        }
    }, [page, sections, hydrate]);

    if (loading) return null;

    return (
        <>
            <PageHeader title="CMS Editor" showBackButton showAddButton={false} />
            <PageInput />
            <TemplateSelector />
            <Renderer />
            <SaveAll />
        </>
    );
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CreateCMS() {
    return (
        <CMSProvider>
            <CreateCMSInner />
        </CMSProvider>
    );
}

/* -------- TEMPLATE SELECTOR -------- */
const TemplateSelector = () => {
    const { addSection } = useCMS();

    const templates = [
        {
            key: "template1",
            title: "How it works",
            Preview: Template1Preview,
        },
        {
            key: "template2",
            title: "Step (Image Right)",
            Preview: Template2Preview,
        },
        {
            key: "template3",
            title: "Step (Image Left)",
            Preview: Template3Preview,
        },
        {
            key: "template4",
            title: "Feature Cards",
            Preview: Template4Preview,
        },
        {
            key: "template5",
            title: "Collapsable Cards",
            Preview: Template5Preview,
        },
        {
            key: "template6",
            title: "Picture Upload",
            Preview: Template6Preview,
        },
    ];

    return (
        <div className="px-6 py-6 border-b bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((t) => (
                    <div
                        key={t.key}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => addSection(t.key as any)}
                        className="cursor-pointer border rounded-lg p-4 hover:border-green-500 hover:bg-green-50 transition"
                    >
                        <div className="mb-3">
                            {t.Preview ? (
                                <t.Preview />
                            ) : (
                                <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                                    Preview
                                </div>
                            )}
                        </div>
                        <h4 className="font-semibold text-black">{t.title}</h4>
                        {/* <p className="text-xs text-gray-500">{t.preview}</p> */}
                    </div>
                ))}
            </div>
        </div>
    );
};
