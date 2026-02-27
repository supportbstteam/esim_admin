"use client";

import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

export type TemplateKey =
  | "templateBanner"
  | "template1"
  | "template2"
  | "template3"
  | "template4"
  | "template5"
  | "template6"
  | "template7"
  | "template8";

export interface Section {
  id: string;
  template: TemplateKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CMSContext = createContext<any>(null);


/* ================= DEFAULT DATA ================= */

const getInitialData = (template: TemplateKey) => {

  switch (template) {

    case "templateBanner":
      return {
        heading: "",
        subHeading: "",
      };

    case "template1":
      return {
        heading: "",
        subHeading: "",
        description: {
          paragraphs: [{ content: "" }]
        },
      };

    case "template2":
    case "template3":
      return {
        stepNumber: "",
        heading: "",
        image: "",
        imageFile: null,
        imagePreview: "",
        description: {
          paragraphs: [{ content: "" }]
        },
      };

    case "template4":
      return {
        items: [
          {
            id: Date.now(),
            icon: "",
            title: "",
            description: "",
          },
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
      return {
        image: "",
        imageFile: null,
        imagePreview: "",
      };

    case "template7":
      return {
        blocks: [
          {
            id: uuid(),
            type: "paragraph",
            content: "",
          },
        ],
      };

    case "template8":
      return {
        content: "<h2>New Section</h2><p>Start writing here...</p>",
      };

    default:
      return {};
  }

};


/* ================= CREATE DEFAULT BANNER ================= */

const createBannerSection = (): Section => ({
  id: "banner", // fixed id
  template: "templateBanner",
  data: getInitialData("templateBanner"),
});


/* ================= PROVIDER ================= */

export const CMSProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [page, setPage] =
    useState<string>("");

  /* ✅ Banner always first section */
  const [sections, setSections] =
    useState<Section[]>([
      createBannerSection()
    ]);


  /* ================= HYDRATE ================= */

  const hydrate = (
    pageFromApi: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sectionsFromApi: any[]
  ) => {

    setPage(pageFromApi);

    if (!sectionsFromApi?.length) {
      setSections([
        createBannerSection()
      ]);
      return;
    }

    const banner =
      sectionsFromApi.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (s: any) =>
          s.template === "templateBanner"
      );

    const otherSections =
      sectionsFromApi.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (s: any) =>
          s.template !== "templateBanner"
      );

    const hydratedBanner =
      banner
        ? {
          id:
            banner.id ||
            "banner",
          template:
            "templateBanner",
          data: {
            ...getInitialData(
              "templateBanner"
            ),
            ...banner.data,
          },
        }
        : createBannerSection();

    const hydratedOthers =
      otherSections.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (s: any) => ({
          id:
            s.id ||
            uuid(),
          template:
            s.template,
          data: {
            ...getInitialData(
              s.template
            ),
            ...s.data,
            imageFile: null,
            imagePreview:
              s.data?.image ||
              "",
          },
        })
      );

    setSections([
      hydratedBanner,
      ...hydratedOthers,
    ]);

  };


  /* ================= ADD SECTION ================= */

  const addSection = (
    template: TemplateKey
  ) => {

    if (
      template ===
      "templateBanner"
    ) return;

    setSections(
      (prev) => [

        prev[0], // keep banner first

        ...prev.slice(1),

        {
          id: uuid(),
          template,
          data:
            getInitialData(
              template
            ),
        },

      ]
    );

  };


  /* ================= UPDATE ================= */

  const updateSection = (
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) => {

    setSections(
      (prev) =>
        prev.map(
          (s) =>
            s.id === id
              ? {
                ...s,
                data,
              }
              : s
        )
    );

  };


  /* ================= REMOVE ================= */

  const removeSection = (
    id: string
  ) => {

    if (id === "banner")
      return;

    setSections(
      (prev) =>
        prev.filter(
          (s) =>
            s.id !== id
        )
    );

  };


  /* ================= PROVIDER ================= */

  return (

    <CMSContext.Provider
      value={{
        page,
        setPage,

        sections,
        setSections,

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


export const useCMS = () =>
  useContext(CMSContext);