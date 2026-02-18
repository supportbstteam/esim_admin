"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function HeadingInput({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [initialized, setInitialized] = useState(false);

  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    fontSize: "16",
    color: "#000000",
  });

  // Initialize content once
  useEffect(() => {
    if (editorRef.current && !initialized) {
      editorRef.current.innerHTML = value || "";
      setInitialized(true);
    }
  }, [value, initialized]);

  // Sync cursor and detect styles at the current position
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRange.current = selection.getRangeAt(0);
      detectActiveStyles();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && savedRange.current) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
  };

  const detectActiveStyles = () => {
    if (typeof document === "undefined") return;

    // Use queryCommandValue for native styles
    const fontSize = document.queryCommandValue("fontSize"); 
    // Note: fontSize returns 1-7 in execCommand, but we are using inline styles for precision
    
    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      fontSize: activeStyles.fontSize, // Persist selection from state
      color: rgbToHex(document.queryCommandValue("foreColor")),
    });
  };

  // Helper to convert RGB from queryCommandValue to Hex for the input[type=color]
  const rgbToHex = (rgb: string) => {
    if (!rgb || !rgb.includes("rgb")) return "#000000";
    const match = rgb.match(/\d+/g);
    if (!match) return "#000000";
    const [r, g, b] = match.map(Number);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const applyStyle = (command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
    triggerChange();
  };

  // Specialized function for Font Size to use Pixels via spans
  const changeFontSize = (size: string) => {
    editorRef.current?.focus();
    restoreSelection();
    
    // We use a temporary command then replace it with pixel size for better control
    document.execCommand("fontSize", false, "7");
    const fontElements = editorRef.current?.getElementsByTagName("font");
    
    if (fontElements) {
      for (let i = 0; i < fontElements.length; i++) {
        if (fontElements[i].size === "7") {
          fontElements[i].removeAttribute("size");
          fontElements[i].style.fontSize = `${size}px`;
        }
      }
    }
    
    setActiveStyles(prev => ({ ...prev, fontSize: size }));
    triggerChange();
  };

  const triggerChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b p-2 bg-gray-50">
        
        {/* Bold & Italic */}
        <div className="flex border-r pr-2 gap-1">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyStyle("bold"); }}
            className={`w-8 h-8 flex items-center justify-center rounded font-bold transition ${
              activeStyles.bold ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          > B </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyStyle("italic"); }}
            className={`w-8 h-8 flex items-center justify-center rounded italic transition ${
              activeStyles.italic ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          > I </button>
        </div>

        {/* Font Size */}
        <select
          value={activeStyles.fontSize}
          onChange={(e) => changeFontSize(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded bg-white text-sm text-black focus:outline-none"
        >
          {["14", "16", "20", "24", "28", "32", "40"].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        {/* Color Picker */}
        <div className="flex items-center gap-2 ml-2">
          <input
            type="color"
            value={activeStyles.color}
            onChange={(e) => applyStyle("foreColor", e.target.value)}
            className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
            title="Text Color"
          />
        </div>
      </div>

      {/* Editor Surface */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={triggerChange}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onPaste={(e) => {
          // Optional: Strip formatting on paste to keep it clean
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
        }}
        className="px-4 py-4 text-black bg-white outline-none min-h-[100px] leading-tight"
        style={{ fontSize: `${activeStyles.fontSize}px` }}
      />
    </div>
  );
}