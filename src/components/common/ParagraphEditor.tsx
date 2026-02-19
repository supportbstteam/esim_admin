"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const savedRange = useRef<Range | null>(null);
  const [fontSize, setFontSize] = useState("16");

  // Table Selector States
  const [showTableGrid, setShowTableGrid] = useState(false);
  const [hoveredGrid, setHoveredGrid] = useState({ r: 0, c: 0 });

  // Grid dimensions
  const GRID_ROWS = 10;
  const GRID_COLS = 10;

  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    listUnordered: false,
    listOrdered: false,
    justifyLeft: false,
    justifyCenter: false,
  });

  useEffect(() => {
    if (editorRef.current && !initialized) {
      editorRef.current.innerHTML = value || "<p><br></p>";
      setInitialized(true);
    }
  }, [value, initialized]);

  const checkActiveStyles = () => {
    if (typeof document === "undefined") return;
    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      listUnordered: document.queryCommandState("insertUnorderedList"),
      listOrdered: document.queryCommandState("insertOrderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
    });
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0);
      checkActiveStyles();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const applyStyle = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(cmd, false, val);
    saveSelection();
    checkActiveStyles();
    onChange(editorRef.current?.innerHTML || "");
  };

  const insertTable = (rows: number, cols: number) => {
    editorRef.current?.focus();
    restoreSelection();

    let tableHTML = `<table style="width: 100%; border-collapse: collapse; margin: 10px 0; border: 1px solid #cbd5e1;"><tbody>`;
    for (let i = 0; i < rows; i++) {
      tableHTML += "<tr>";
      for (let j = 0; j < cols; j++) {
        tableHTML += `<td style="border: 1px solid #cbd5e1; padding: 12px; min-width: 50px;"><br></td>`;
      }
      tableHTML += "</tr>";
    }
    tableHTML += `</tbody></table><p><br></p>`;

    document.execCommand("insertHTML", false, tableHTML);
    setShowTableGrid(false);
    onChange(editorRef.current?.innerHTML || "");
  };

  const applyFontSize = (size: string) => {
    setFontSize(size);
    editorRef.current?.focus();
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    if (!range.collapsed) {
      document.execCommand("fontSize", false, "7");
      Array.from(editorRef.current?.getElementsByTagName("font") || []).forEach(el => {
        if (el.size === "7") {
          el.removeAttribute("size");
          el.style.fontSize = `${size}px`;
        }
      });
    } else {
      const span = document.createElement("span");
      span.style.fontSize = `${size}px`;
      span.innerHTML = "&#8203;";
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.setStart(span, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
    saveSelection();
    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 items-center">

        {/* Style Group */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton onClick={() => applyStyle("bold")} title="Bold" active={activeStyles.bold}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle("italic")} title="Italic" active={activeStyles.italic}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </ToolbarButton>
        </div>

        {/* Font Controls */}
        <div className="flex gap-1 px-2 border-r border-gray-300">
          <select 
            className="h-8 px-1 border rounded bg-white text-xs text-black outline-none"
            onChange={(e) => applyStyle("formatBlock", e.target.value)}
          >
            <option value="p">Paragraph</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
          </select>

          <select 
            value={fontSize} 
            onChange={(e) => applyFontSize(e.target.value)}
            className="h-8 px-1 border rounded bg-white text-xs text-black outline-none w-16"
          >
            {["12", "14", "16", "18", "20", "24", "32", "40"].map(s => (
              <option key={s} value={s}>{s}px</option>
            ))}
          </select>
        </div>

        {/* --- WIDER TABLE SELECTOR --- */}
        <div className="relative px-2 border-r w-1/2 border-gray-300">
          <ToolbarButton 
            onClick={() => setShowTableGrid(!showTableGrid)} 
            title="Insert Table"
            active={showTableGrid}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
            </svg>
          </ToolbarButton>

          {showTableGrid && (
            <div className="absolute top-10 left-0 z-50 bg-white border border-gray-300 p-4 shadow-2xl rounded-lg animate-in fade-in slide-in-from-top-1 ">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Insert Table</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {hoveredGrid.r > 0 ? `${hoveredGrid.r} x ${hoveredGrid.c}` : "Select size"}
                </span>
              </div>

              {/* The Grid Container - Adjusted for 10 columns */}
              <div 
                className="grid gap-1.5" 
                style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
                onMouseLeave={() => setHoveredGrid({ r: 0, c: 0 })}
              >
                {[...Array(GRID_ROWS * GRID_COLS)].map((_, i) => {
                  const r = Math.floor(i / GRID_COLS) + 1;
                  const c = (i % GRID_COLS) + 1;
                  const isHighlighted = r <= hoveredGrid.r && c <= hoveredGrid.c;
                  return (
                    <div 
                      key={i}
                      onMouseEnter={() => setHoveredGrid({ r, c })}
                      onClick={() => insertTable(r, c)}
                      className={`w-6 h-6 border transition-all  cursor-pointer rounded-sm ${
                        isHighlighted 
                          ? "bg-green-500 border-green-600 scale-110 shadow-sm z-10" 
                          : "bg-gray-50 border-gray-200 hover:border-gray-400"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Alignment & Color */}
        <div className="flex gap-1 px-2 items-center">
          <ToolbarButton onClick={() => applyStyle("justifyLeft")} title="Align Left">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          </ToolbarButton>
          <div className="flex items-center ml-2 pl-2 border-l border-gray-300">
            <input 
                type="color" 
                onChange={(e) => applyStyle("foreColor", e.target.value)}
                className="w-6 h-6 p-0 border border-gray-200 rounded-full cursor-pointer shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* EDITOR AREA */}
      <div
        ref={editorRef}
        contentEditable
        onInput={() => {
          checkActiveStyles();
          onChange(editorRef.current?.innerHTML || "");
        }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        className="p-6 min-h-[200px] outline-none bg-white text-black prose max-w-none transition-all 
                   [&_table]:border-collapse [&_table]:w-full [&_table]:my-6
                   [&_td]:border [&_td]:border-gray-300 [&_td]:p-3 [&_td]:min-w-[80px] 
                   [&_td:focus]:outline-none [&_td:focus]:ring-2 [&_td:focus]:ring-blue-400 [&_td:focus]:bg-blue-50/50"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
}

function ToolbarButton({ children, onClick, title, active }: { children: React.ReactNode, onClick: () => void, title: string, active?: boolean }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`w-9 h-9 flex cursor-pointer items-center justify-center rounded-md transition-all  ${
        active ? "bg-green-600 text-white shadow-md scale-105" : "text-gray-600 hover:bg-gray-200"
      }`}
      title={title}
    >
      {children}
    </button>
  );
}

