"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiMove } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* --- COMPONENT IMPORTS --- */
import PageHeader from "@/components/common/PageHeader";
import PageInput from "@/components/modals/PageSelector";
import Template1Preview from "@/components/templates/previews/TemplatePreview1";
import Template2Preview from "@/components/templates/previews/TemplatePreview2";
import Template3Preview from "@/components/templates/previews/TemplatePreview3";
import Template4Preview from "@/components/templates/previews/TemplatePreview4";
import Template5Preview from "@/components/templates/previews/TemplatePreview5";
import Template6Preview from "@/components/templates/previews/TemplatePreview6";
import Template7Preview from "@/components/templates/previews/TemplatePreview7";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";
import Template4 from "@/components/templates/Template4";
import Template5 from "@/components/templates/Template5";
import Template6 from "@/components/templates/Template6";
import Template7 from "@/components/templates/Template7";
import BannerTemplate from "@/components/templates/BannerTemplate";
import { CMSProvider, useCMS } from "@/components/useCMS";
import { useAppDispatch, useAppSelector } from "@/store";
import { savePage } from "@/store/thunks/CmsPageThunk";
import { handleImageUploadForSection } from "@/utils/handleTemplate6";
import toast from "react-hot-toast";
import FullscreenLoader from "@/components/modals/FullScreenLoading";
import Template8Preview from "@/components/templates/previews/TemplatePreview8";
import Template8 from "@/components/templates/Template8";
import { IoAddCircleOutline } from "react-icons/io5";

/* -------- SORTABLE ITEM WRAPPER -------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/* -------- SORTABLE ITEM WRAPPER -------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SortableSection = ({ section, removeSection }: { section: any; removeSection: (id: string) => void }) => {

    const isBanner = section.template === "templateBanner";

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: section.id,
        disabled: isBanner // ✅ Banner cannot be dragged
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative border rounded-lg group bg-white transition-shadow ${isDragging ? "shadow-2xl ring-2 ring-green-500 opacity-60" : "shadow-sm"
                }`}
        >

            {/* 🖐 DRAG HANDLE */}
            {!isBanner && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-3 left-3 z-10 p-2 rounded-md bg-gray-50 border border-gray-200 text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition shadow-sm"
                    title="Drag to reorder"
                >
                    <FiMove size={18} />
                </div>
            )}

            {/* 🗑 DELETE ICON */}
            {!isBanner && (
                <button
                    onClick={() => removeSection(section.id)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Delete template"
                >
                    <FiTrash2 size={18} />
                </button>
            )}

            {/* TEMPLATE RENDER */}
            <div className="p-1">

                {section.template === "templateBanner" && (
                    <BannerTemplate section={section} />
                )}

                {section.template === "template1" && <Template1 section={section} />}
                {section.template === "template2" && <Template2 section={section} />}
                {section.template === "template3" && <Template3 section={section} />}
                {section.template === "template4" && <Template4 section={section} />}
                {section.template === "template5" && <Template5 section={section} />}
                {section.template === "template6" && <Template6 section={section} />}
                {section.template === "template7" && <Template7 section={section} />}
                {section.template === "template8" && <Template8 section={section} />}

            </div>
        </div>
    );
};

/* -------- RENDERER WITH DND LOGIC -------- */
// const Renderer = () => {
//     const { sections, removeSection, setSections } = useCMS();

//     const sensors = useSensors(
//         useSensor(PointerSensor, {
//             activationConstraint: { distance: 8 }, // Prevents accidental drags when clicking inputs
//         }),
//         useSensor(KeyboardSensor, {
//             coordinateGetter: sortableKeyboardCoordinates,
//         })
//     );

//     const handleDragEnd = (event: DragEndEvent) => {
//         const { active, over } = event;

//         if (over && active.id !== over.id) {
//             const oldIndex = sections.findIndex((s) => s.id === active.id);
//             const newIndex = sections.findIndex((s) => s.id === over.id);

//             // Reorders the array and updates state
//             setSections(arrayMove(sections, oldIndex, newIndex));
//         }
//     };

//     if (!sections.length) {
//         return (
//             <div className="text-center py-20 text-gray-400">
//                 Add templates to start building the page
//             </div>
//         );
//     }

//     return (
//         <DndContext
//             sensors={sensors}
//             collisionDetection={closestCenter}
//             onDragEnd={handleDragEnd}
//         >
//             <div className="space-y-12 px-6 py-10">
//                 <SortableContext
//                     items={sections.map(s => s.id)}
//                     strategy={verticalListSortingStrategy}
//                 >
//                     {sections.map((section) => (
//                         <SortableSection
//                             key={section.id}
//                             section={section}
//                             removeSection={removeSection}
//                         />
//                     ))}
//                 </SortableContext>
//             </div>
//         </DndContext>
//     );
// };

const Renderer = () => {
    const { banner, sections, removeSection, setSections } = useCMS();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);

            setSections(arrayMove(sections, oldIndex, newIndex));
        }
    };

    return (
        <div>

            {/* ✅ BANNER ALWAYS FIRST (NOT SORTABLE) */}
            {/* <div className="px-6 pt-6">
                <div className="relative border-2 border-green-500 rounded-lg bg-white shadow-md">

                    <div className="absolute top-2 left-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                        Banner
                    </div>

                    <BannerTemplate />
                </div>
            </div> */}

            {/* SORTABLE SECTIONS */}
            {sections.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    Add templates to start building the page
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="space-y-12 px-6 py-10">
                        <SortableContext
                            items={sections.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {sections.map((section) => (
                                <SortableSection
                                    key={section.id}
                                    section={section}
                                    removeSection={removeSection}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>
            )}

        </div>
    );
};


/* -------- SAVE LOGIC -------- */
const SaveAll = () => {

    const { id } = useAppSelector(state => state?.cmsPages);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { sections, page, banner } = useCMS();

    const saveAll = async () => {
        try {
            const processedSections = [];
            for (const section of sections) {
                if (["template2", "template3", "template6"].includes(section.template)) {
                    const updated = await handleImageUploadForSection(section);
                    processedSections.push({ template: updated.template, data: updated.data });
                } else {
                    processedSections.push({ template: section.template, data: section.data });
                }
            }

            // console.log("-=-=-=-= processed Sections -=-=-=-=",processedSections);

            const response = await dispatch(savePage({ page, sections: processedSections, id: id || "" }));

            console.log("--=-=- response in the create dispatch -=-=-=-", response, id);

            if (response?.type === 'cms/savePage/fulfilled') {

                if (id && (id.length > 0)) {
                    toast.success("Page Updated Successfully");
                    router.back()
                }
                else {
                    toast.success("Page Created Successfully")
                    router.back()
                }
            }

            // console.log("-=-=-=- response in the cms editors -=-=-=-=-=-",response);
            // router.back(); 
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    return (
        <div className="flex justify-end px-6 py-10 border-t bg-gray-50">
            <button
                onClick={saveAll}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg cursor-pointer font-bold shadow-lg transition"
            >
                Save All Templates
            </button>
        </div>
    );
};

/* -------- MAIN PAGES AND SELECTORS -------- */
const TemplateSelector = () => {
    const { addSection } = useCMS();
    const [isSticky, setIsSticky] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Determine stickiness based on whether the sentinel is above the viewport
                setIsSticky(entry.boundingClientRect.top < 10);
            },
            {
                threshold: [1],
                // Root margin detects the intersection slightly above the actual top
                rootMargin: "0px 10px 0px 0px"
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) observer.disconnect();
        };
    }, []);

    const templates = [
        { key: "template1", title: "How it works", Preview: Template1Preview },
        { key: "template2", title: "Step (Right)", Preview: Template2Preview },
        { key: "template3", title: "Step (Left)", Preview: Template3Preview },
        { key: "template4", title: "Features", Preview: Template4Preview },
        { key: "template5", title: "Collapse", Preview: Template5Preview },
        { key: "template6", title: "Image", Preview: Template6Preview },
        { key: "template7", title: "Blocks", Preview: Template7Preview },
        { key: "template8", title: "Rich Text", Preview: Template8Preview },
    ];

    return (
        <>
            {/* THE SENTINEL 
                Positioned absolutely relative to a zero-height container 
                so it doesn't move when the sticky bar changes size.
            */}
            <div className="relative w-full">
                <div
                    ref={sentinelRef}
                    className="absolute top-[-1px] left-0 w-full h-px pointer-events-none"
                />
            </div>

            <div
  className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out border-b bg-white/95 backdrop-blur-sm ${
    isSticky ? "py-2 shadow-md" : "py-6"
  }`}
>
  <div className="max-w-7xl mx-auto px-6">
    {/* Label for Non-Sticky State */}
    {!isSticky && (
      <p className="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-widest">
        Available Templates
      </p>
    )}

    {/* Horizontal Scroll Container */}
    <div className="flex flex-row items-stretch gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
      {templates.map((t) => (
        <div
          key={t.key}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={() => addSection(t.key as any)}
          className={`
            relative cursor-pointer shrink-0 snap-start transition-all duration-200
            border rounded-xl flex flex-col items-center justify-center group
            ${isSticky 
              ? "w-32 h-12 p-1 border-transparent hover:bg-green-50" 
              : "w-44 p-3 border-gray-100 shadow-sm hover:border-green-500 hover:shadow-md hover:-translate-y-1 bg-white"
            }
          `}
        >
          {/* Visual Preview (Hidden in Sticky) */}
          {!isSticky && (
            <div className="mb-3 w-full opacity-80 group-hover:opacity-100 transition-opacity">
              {t.Preview ? (
                <t.Preview />
              ) : (
                <div className="h-20 bg-gray-50 rounded-lg border border-dashed border-gray-200" />
              )}
            </div>
          )}

          {/* Title with Badge Style for Sticky */}
          <h4 className={`
            font-bold text-black text-center truncate w-full px-2
            ${isSticky 
              ? "text-[11px] uppercase tracking-tighter bg-gray-50 py-1.5 rounded-lg group-hover:bg-green-100 group-hover:text-green-700 transition-colors" 
              : "text-xs group-hover:text-green-600"
            }
          `}>
            {t.title}
          </h4>

          {/* Hover indicator for adding */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="bg-green-500 text-white rounded-full p-0.5">
                <IoMdAdd size={12} color="#fff" />
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <style jsx global>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
</div>

        </>
    );
};

const CreateCMSInner = () => {
    const { page, sections, loading, id } = useAppSelector((state) => state.cmsPages);
    const { hydrate } = useCMS();
    const hydratedRef = React.useRef(false);


    // console.log("-=-=- page in the CMS PAGES EDTIOR -=-=-=-", page);

    React.useEffect(() => {
        if (!hydratedRef.current && page && sections?.length > 0) {
            hydrate(page, sections);
            hydratedRef.current = true;
        }
    }, [page, sections, hydrate]);

    // if (loading) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {loading && <FullscreenLoader text="Loading CMS Editor..." />}
            <PageHeader title="CMS Editor" showBackButton showAddButton={false} />
            <PageInput />
            <TemplateSelector />
            <Renderer />
            <SaveAll />
        </div>
    );
};

export default function CreateCMS() {
    return (
        <CMSProvider>
            <CreateCMSInner />
        </CMSProvider>
    );
}