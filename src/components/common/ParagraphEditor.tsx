"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const savedRange = useRef<Range | null>(null);
  const [fontSize, setFontSize] = useState("16");
  
  // Track active styles for UI highlighting
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
      checkActiveStyles(); // Sync icons when selection changes
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
    checkActiveStyles(); // Immediately update UI
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
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle("italic")} title="Italic" active={activeStyles.italic}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle("underline")} title="Underline" active={activeStyles.underline}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
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

        {/* Alignment */}
        <div className="flex gap-1 px-2 border-r border-gray-300">
          <ToolbarButton onClick={() => applyStyle("justifyLeft")} title="Align Left" active={activeStyles.justifyLeft}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle("justifyCenter")} title="Align Center" active={activeStyles.justifyCenter}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
          </ToolbarButton>
        </div>

        {/* Lists & Color */}
        <div className="flex gap-1 px-2 items-center">
          <ToolbarButton onClick={() => applyStyle("insertUnorderedList")} title="Bullet List" active={activeStyles.listUnordered}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </ToolbarButton>
          
          <div className="relative flex items-center ml-2 group" title="Text Color">
             <input 
              type="color" 
              onChange={(e) => applyStyle("foreColor", e.target.value)}
              className="w-6 h-6 p-0 border border-gray-300 rounded overflow-hidden cursor-pointer shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* EDITOR */}
      <div
        ref={editorRef}
        contentEditable
        onInput={() => {
          checkActiveStyles();
          onChange(editorRef.current?.innerHTML || "");
        }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        className="p-4 min-h-[200px] outline-none bg-white text-black prose max-w-none transition-all"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
}

function ToolbarButton({ children, onClick, title, active }: { children: React.ReactNode, onClick: () => void, title: string, active?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`w-8 h-8 flex items-center justify-center rounded transition-all duration-200 ${
        active 
          ? "bg-blue-100 text-blue-600 shadow-inner" 
          : "text-gray-600 hover:bg-gray-200 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}