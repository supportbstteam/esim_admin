"use client";

import { Formik, FieldArray } from "formik";
import { FiTrash2, FiPlus, FiGrid, FiAlignLeft } from "react-icons/fi";
import { useCMS } from "../useCMS";
import FormikSync from "@/lib/formikSync";
import CustomEditor from "../common/ParagraphEditor";

/* ================= TYPES ================= */

type BlockType = "paragraph" | "cards";

interface Card {
  id: number;
  content: string;
  bgColor: string;
}

interface Block {
  id: string;
  type: BlockType;
  content?: string;
  cards?: Card[];
  columns?: number;
}

interface Template7Values {
  blocks: Block[];
}

interface Props {
  section: {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  };
}

/* ================= HELPERS ================= */

const createParagraph = (content?: string): Block => ({
  id: `p-${Date.now()}-${Math.random()}`,
  type: "paragraph",
  content: content ?? "<h2>Section Heading</h2><p>Start typing...</p>",
});

const createCardBlock = (cards?: Card[], columns?: number): Block => ({
  id: `c-${Date.now()}-${Math.random()}`,
  type: "cards",
  columns: columns ?? 3,
  cards: cards ?? [
    { id: Date.now() + 1, content: "<h3>Card 1</h3>", bgColor: "#ffffff" },
  ],
});

/* ================= MAIN ================= */

export default function Template7({ section }: Props) {
  const { updateSection } = useCMS();

  // THIS IS THE FIX: Convert old data structure to the new Block structure
  const getInitialBlocks = (): Block[] => {
    const data = section.data;

    // 1. If it's already in the new 'blocks' format, return it
    if (data?.blocks && Array.isArray(data.blocks)) {
      return data.blocks;
    }

    // 2. If it's in the OLD format (heading/cards), convert it on the fly
    if (data?.heading || data?.cards) {
      const convertedBlocks: Block[] = [];

      if (data.heading) {
        convertedBlocks.push(createParagraph(data.heading));
      }

      if (data.cards && data.cards.length > 0) {
        convertedBlocks.push(createCardBlock(data.cards, data.columns));
      }

      return convertedBlocks;
    }

    // 3. Fallback: Default mandatory paragraph
    return [createParagraph()];
  };

  return (
    <Formik<Template7Values>
      enableReinitialize
      initialValues={{
        blocks: getInitialBlocks(),
      }}
      onSubmit={() => { }}
    >
      {({ values, setFieldValue }) => (
        <form className="p-6 space-y-8 bg-white border border-gray-200 rounded-xl shadow-sm">
          <FormikSync onChange={(vals) => updateSection(section.id, vals)} />

          <FieldArray name="blocks">
            {({ push, remove }) => (
              <div className="space-y-10">
                {values.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="relative p-6 border border-gray-200 rounded-xl bg-gray-50/30"
                  >
                    {/* Block Header */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase text-gray-400">
                        {block.type === 'paragraph' ? 'Text Block' : 'Cards Block'}
                      </span>
                      {values.blocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 cursor-pointer hover:bg-red-50 p-1 rounded"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* Content Rendering */}
                    {block.type === "paragraph" ? (
                      <div className="bg-white rounded-lg border border-gray-300">
                        <CustomEditor
                          value={block.content || ""}
                          onChange={(val) => setFieldValue(`blocks.${index}.content`, val)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-black font-semibold">Columns:</label>
                          <select
                            value={block.columns}
                            onChange={(e) => setFieldValue(`blocks.${index}.columns`, Number(e.target.value))}
                            className="border text-black cursor-pointer rounded px-2 py-1 text-sm bg-white"
                          >
                            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Cols</option>)}
                          </select>
                        </div>

                        {/* Individual Cards Grid */}
                        <div
                          className="grid gap-4"
                          style={{ gridTemplateColumns: `repeat(${block.columns}, minmax(0, 1fr))` }}
                        >
                          {block.cards?.map((card, cIndex) => (
                            <div key={card.id || cIndex} className="p-4 bg-white border rounded-lg shadow-sm space-y-3">

                              {/* Card Toolbar: Color Picker + Delete Card */}
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={card.bgColor}
                                    onChange={(e) => setFieldValue(`blocks.${index}.cards.${cIndex}.bgColor`, e.target.value)}
                                    className="w-6 h-6 cursor-pointer rounded border-none bg-transparent"
                                  />
                                  <span className="text-[10px] uppercase text-gray-400 font-bold">Bg</span>
                                </div>

                                {/* REMOVE INDIVIDUAL CARD BUTTON */}
                                {block.cards && block.cards.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedCards = block.cards?.filter((_, i) => i !== cIndex);
                                      setFieldValue(`blocks.${index}.cards`, updatedCards);
                                    }}
                                    className="text-gray-300 cursor-pointer hover:text-red-500 transition-colors"
                                    title="Remove this card"
                                  >
                                    <FiTrash2 size={18} />
                                  </button>
                                )}
                              </div>

                              <CustomEditor
                                value={card.content}
                                onChange={(val) => setFieldValue(`blocks.${index}.cards.${cIndex}.content`, val)}
                              />
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newCard = { id: Date.now(), content: "New Card", bgColor: "#ffffff" };
                            setFieldValue(`blocks.${index}.cards`, [...(block.cards || []), newCard]);
                          }}
                          className="text-sm cursor-pointer text-green-600 font-bold"
                        >
                          + Add Individual Card
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* ADD BLOCK BUTTONS */}
                <div className="flex justify-center gap-4 p-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => push(createParagraph())}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold"
                  >
                    <FiAlignLeft /> Add Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => push(createCardBlock())}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold"
                  >
                    <FiGrid /> Add Cards
                  </button>
                </div>
              </div>
            )}
          </FieldArray>
        </form>
      )}
    </Formik>
  );
}