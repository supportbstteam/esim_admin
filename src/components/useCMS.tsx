"use client";

import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

export type TemplateKey =
  | "template1"
  | "template2"
  | "template3"
  | "template4"
  | "template5"
  | "template6"
  | "template7"; // Added template7

export interface Section {
  id: string;
  template: TemplateKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CMSContext = createContext<any>(null);

const getInitialData = (template: TemplateKey) => {
  switch (template) {
    case "template1":
      return {
        heading: "",
        subHeading: "",
        description: { paragraphs: [{ content: "" }] },
      };
    case "template2":
    case "template3":
      return {
        stepNumber: "",
        heading: "",
        image: "",          
        imageFile: null,    
        imagePreview: "",   
        description: { paragraphs: [{ content: "" }] },
      };
    case "template4":
      return {
        items: [
          { id: Date.now(), icon: "", title: "", description: "" },
        ],
      };
    case "template5":
      return {
        heading: "",
        isCollapsable: true,
        description: {
          paragraphs: [{ content: "" }],
        },
      };
    case "template6":
      // ✅ Schema for Image Upload Template
      return {
        image: "",
        imageFile: null,
        imagePreview: "",
      };
    case "template7":
      // ✅ Schema for Block-based Dynamic Template
      return {
        blocks: [
          { id: uuid(), type: "paragraph", content: "" }
        ],
      };
    default:
      return {};
  }
};

export const CMSProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState<string>(""); 
  const [sections, setSections] = useState<Section[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hydrate = (page: string, sectionsFromApi: any[]) => {
    setPage(page);
    setSections(
      sectionsFromApi.map((s) => {
        const defaults = getInitialData(s.template);

        return {
          id: s.id,
          template: s.template,
          data: {
            ...defaults,   
            ...s.data,     
            imageFile: null,      
            imagePreview: "",     
          },
        };
      })
    );
  };

  const addSection = (template: TemplateKey) => {
    setSections((prev) => [
      ...prev,
      {
        id: uuid(),
        template,
        data: getInitialData(template),
      },
    ]);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSection = (id: string, data: any) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, data } : s))
    );
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <CMSContext.Provider
      value={{
        page,
        setPage,
        sections,
        setSections, // 🔥 EXPOSED: Required for dnd-kit reordering
        hydrate,
        addSection,
        updateSection,
        removeSection,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);