"use client";

import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

export type TemplateKey =
  | "template1"
  | "template2"
  | "template3"
  | "template4"
  | "template5"
  | "template6";

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
        image: "",          // DB value
        imageFile: null,    // UI only
        imagePreview: "",   // UI only
        description: { paragraphs: [{ content: "" }] },
      };
    // case "template2":
    // case "template3":
    //   return {
    //     stepNumber: "",
    //     heading: "",
    //     image: "",
    //     description: { paragraphs: [{ content: "" }] },
    //   };
    case "template4":
      return {
        items: [
          { id: Date.now(), icon: "", title: "", description: "" },
        ],
      };
    case "template5":
      // ✅ Collapsible / Terms / FAQ
      return {
        heading: "",
        isCollapsable: true,
        description: {
          paragraphs: [{ content: "" }],
        },
      };
    default:
      return {};
  }
};

export const CMSProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState<string>(""); // 🔥 NEW
  const [sections, setSections] = useState<Section[]>([]);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const hydrate = (page: string, sectionsFromApi: any[]) => {
  //   setPage(page);
  //   setSections(
  //     sectionsFromApi.map((s) => {

  //       console.log(" -=-=-=-=-= s in the use CMS -=-==-=-=", s);
  //       return ({
  //         id: s.id,
  //         template: s.template,
  //         data: s.data,
  //       })
  //     })
  //   );
  // };


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
            ...defaults,   // ensure missing keys exist
            ...s.data,     // DB data overrides defaults
            imageFile: null,      // always reset
            imagePreview: "",     // always reset
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
        page,        // 🔥 expose
        setPage,     // 🔥 expose
        sections,
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
