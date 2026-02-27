"use client";

import { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { FiTrash2 } from "react-icons/fi";

import { useCMS } from "../useCMS";
import { template1Schema } from "@/lib/templateSchema";
import FormikSync from "@/lib/formikSync";

import ParagraphEditor from "@/components/common/ParagraphEditor";
import HeadingInput from "@/components/common/HeadingInput";
import RichTextEditor from "../common/RichTextEditor";

/* ================= TYPES ================= */

interface Paragraph {
  content: string;
  position: "left" | "right" | "down";
}

interface Template1Values {
  heading: string;
  subHeading: string;
  description: {
    paragraphs: Paragraph[];
  };
}

interface Props {
  section: {
    id: string;
    data: Template1Values;
  };
}

/* ================= DEFAULT PARAGRAPH ================= */

const createDefaultParagraph = (): Paragraph => ({
  content: "<p>New paragraph...</p>",
  position: "right",
});

/* ================= MAIN COMPONENT ================= */

export default function Template1({ section }: Props) {
  const { updateSection } = useCMS();

  return (
    <Formik<Template1Values>
      enableReinitialize
      initialValues={{
        ...section.data,
        description: {
          paragraphs: section.data?.description?.paragraphs?.length
            ? section.data.description.paragraphs
            : [createDefaultParagraph()],
        },
      }}
      validationSchema={template1Schema}
      onSubmit={() => { }}
    >
      {({ values, setFieldValue }) => {
        const paragraphs = values.description.paragraphs;

        /* ================= UPDATE PARAGRAPHS ================= */
        // Logic fix: We no longer force-add a "right" paragraph.
        const updateParagraphs = (newList: Paragraph[]) => {
          setFieldValue("description.paragraphs", newList);
        };

        /* ================= FILTERING LOGIC ================= */
        const leftParagraphs = paragraphs.filter((p) => p.position === "left");
        const rightParagraphs = paragraphs.filter((p) => p.position === "right");
        const downParagraphs = paragraphs.filter((p) => p.position === "down");

        const hasLeft = leftParagraphs.length > 0;

        /* ================= ACTIONS ================= */
        const addParagraph = () => {
          updateParagraphs([...paragraphs, createDefaultParagraph()]);
        };

        const removeParagraph = (index: number) => {
          const updated = paragraphs.filter((_, i) => i !== index);
          updateParagraphs(updated);
        };

        const changePosition = (
          index: number,
          position: "left" | "right" | "down"
        ) => {
          const updated = paragraphs.map((p, i) =>
            i === index ? { ...p, position } : p
          );
          updateParagraphs(updated);
        };

        return (
          <form className="bg-gray-50 border border-gray-200 rounded-lg py-12 shadow-sm">
            <FormikSync
              onChange={(vals) => updateSection(section.id, vals)}
            />

            <div className="max-w-7xl mx-auto px-6 space-y-12">

              {/* TOP GRID: LEFT & RIGHT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* COLUMN 1 */}
                <div className="space-y-6">
                  {hasLeft ? (
                    leftParagraphs.map((paragraph) => {
                      const index = paragraphs.indexOf(paragraph);
                      return (
                        <ParagraphBlock
                          key={index}
                          paragraph={paragraph}
                          index={index}
                          changePosition={changePosition}
                          removeParagraph={removeParagraph}
                          setFieldValue={setFieldValue}
                        />
                      );
                    })
                  ) : (
                    <HeadingBlock values={values} setFieldValue={setFieldValue} />
                  )}
                </div>

                {/* COLUMN 2 */}
                <div className="space-y-6">
                  {hasLeft ? (
                    <HeadingBlock values={values} setFieldValue={setFieldValue} />
                  ) : (
                    rightParagraphs.map((paragraph) => {
                      const index = paragraphs.indexOf(paragraph);
                      return (
                        <ParagraphBlock
                          key={index}
                          paragraph={paragraph}
                          index={index}
                          changePosition={changePosition}
                          removeParagraph={removeParagraph}
                          setFieldValue={setFieldValue}
                        />
                      );
                    })
                  )}
                </div>
              </div>

              {/* BOTTOM SECTION: DOWN */}
              <div className="pt-6 border-t border-gray-200 space-y-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Full Width Section (Down)
                </h3>
                {downParagraphs.length > 0 ? (
                  downParagraphs.map((paragraph) => {
                    const index = paragraphs.indexOf(paragraph);
                    return (
                      <ParagraphBlock
                        key={index}
                        paragraph={paragraph}
                        index={index}
                        changePosition={changePosition}
                        removeParagraph={removeParagraph}
                        setFieldValue={setFieldValue}
                      />
                    );
                  })
                ) : (
                  <p className="text-gray-400 italic text-sm text-center py-4 border-2 border-dashed rounded-lg">
                    No paragraphs moved to the bottom section yet.
                  </p>
                )}
              </div>

              {/* ADD ACTION */}
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={addParagraph}
                  className="flex cursor-pointer items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all shadow-md active:scale-95"
                >
                  <span className="text-xl">+</span> Add New Paragraph
                </button>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

/* ================= HEADING BLOCK ================= */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeadingBlock({ values, setFieldValue }: any) {
  return (
    <div className="space-y-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Main Heading
        </label>
        <input
          value={values.heading}
          onChange={(e) => setFieldValue("heading", e.target.value)}
          placeholder="Enter heading text..."
          className="w-full border border-gray-300 rounded-md p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Sub Heading Style
        </label>
        <HeadingInput
          value={values.subHeading}
          onChange={(html) => setFieldValue("subHeading", html)}
        />
      </div>
    </div>
  );
}

/* ================= PARAGRAPH BLOCK ================= */

function ParagraphBlock({
  paragraph,
  index,
  changePosition,
  removeParagraph,
  setFieldValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <div className="bg-white p-5 border border-gray-300 rounded-xl relative shadow-sm hover:shadow-md transition-shadow group">
      {/* HEADER WITH CONTROLS */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-gray-400 uppercase">
            Pos:
          </span>
          <select
            value={paragraph.position}
            onChange={(e) => changePosition(index, e.target.value)}
            className="bg-gray-100 border border-gray-200 text-gray-800 text-sm font-medium rounded-lg p-1.5 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
          >
            <option value="left">Left Column</option>
            <option value="right">Right Column</option>
            <option value="down">Full Width (Down)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => removeParagraph(index)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          title="Delete Paragraph"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      {/* EDITOR AREA */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <RichTextEditor
          value={paragraph.content}
          onChange={(html) => {
            // console.log("Updating paragraph content:", html);
            // return;
            setFieldValue(`description.paragraphs.${index}.content`, html)
          }}
        />
        {/* <ParagraphEditor
          value={paragraph.content}
          onChange={(html) =>
            setFieldValue(`description.paragraphs.${index}.content`, html)
          }
        /> */}
      </div>
    </div>
  );
}