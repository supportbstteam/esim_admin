"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchContent, fetchAllContent, saveContentThunk } from "@/store/slice/contentSlice";
import type { EditorProps } from "react-draft-wysiwyg";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi";
import PageHeader from "../common/PageHeader";
import { useRouter } from "next/navigation";

export const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

interface ContentEditorProps {
  page: string; // e.g., "about", "privacy", "other"
}

export default function ContentEditor({ page }: ContentEditorProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const content = useAppSelector((state) => state.contents.contents[page]);
  const loading = useAppSelector((state) => state.contents.loading);
  const error = useAppSelector((state) => state.contents.error);


  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState(page !== "other" ? content?.title || page : "");
  const [initialized, setInitialized] = useState(false);

  // NEW: toggle to view/edit raw HTML
  const [showHtml, setShowHtml] = useState(false);
  const [htmlText, setHtmlText] = useState<string>("");

  // Fetch content on page change (only once per page)
  useEffect(() => {
    if (page && !initialized && page !== "other") {
      dispatch(fetchContent(page));
      setInitialized(true);
    }
  }, [dispatch, page, initialized]);

  // Update editor when content.html changes
  useEffect(() => {
    if (content?.html) {
      try {
        const blocks = htmlToDraft(content.html);
        if (blocks) {
          const contentState = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
          setEditorState(EditorState.createWithContent(contentState));
          setHtmlText(content.html);
          if (page !== "other") setTitle(content.title || page);
        }
      } catch (err) {
        // fallback to empty editor if parsing fails
        setEditorState(EditorState.createEmpty());
        setHtmlText("");
      }
    } else {
      setEditorState(EditorState.createEmpty());
      setHtmlText("");
    }
  }, [content, page]);

  // ✅ FIX: Removed auto-sync to prevent overwriting HTML with stripped version
  // (keeping user HTML safe and intact)

  const handleSave = async () => {
    // ✅ FIX: Save raw HTML directly when in HTML mode (preserves Tailwind classes, etc.)
    const html = showHtml
      ? htmlText
      : draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (!title) {
      toast.error("Please enter a title for the page.");
      return;
    }

    try {
      const response = await dispatch(saveContentThunk({ page: title.split(" ")[0].toLowerCase(), html, title }));

      if (saveContentThunk.fulfilled.match(response)) {
        toast.success(
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-green-600 text-xl" />
            <span>{title} saved successfully!</span>
          </div>
        );
        dispatch(fetchAllContent());
      } else if (saveContentThunk.rejected.match(response)) {
        const message = typeof response.payload === "string" ? response.payload : "Failed to save content.";
        toast.error(
          <div className="flex items-center gap-2">
            <FiXCircle className="text-red-600 text-xl" />
            <span>{message}</span>
          </div>
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      toast.error(
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="text-yellow-600 text-xl" />
          <span>{message}</span>
        </div>
      );
    }
  };

  // ✅ FIX: Simplified — no longer re-parses HTML when toggling (prevents class loss)
  const handleToggleHtml = () => {
    setShowHtml((prev) => !prev);
  };

  // Helper: force-load current HTML into editor (manual)
  const loadHtmlIntoEditor = () => {
    try {
      const blocks = htmlToDraft(htmlText || "");
      if (blocks) {
        const contentState = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
        setEditorState(EditorState.createWithContent(contentState));
        setShowHtml(false);
        toast.success("HTML loaded into editor.");
      } else {
        toast.error("No content to load.");
      }
    } catch {
      toast.error("Invalid HTML — could not parse.");
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <PageHeader
        title={page === "other" ? "Add New CMS Page" : `${title}`}
        showAddButton={false}
      />

      {/* Input for "other" page */}
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-[#16325d]">
          Page Key {page === "other" && <>(e.g., refund, disclaimer):</>}
        </label>
        <input
          type="text"
          placeholder="Enter page key..."
          className="border border-gray-300 rounded p-2 w-full text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Editor or Raw HTML */}

      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1" ></div>
        <button
          onClick={handleToggleHtml}
          className="px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-sm border"
        >
          {showHtml ? "Switch to WYSIWYG" : "View / Edit HTML"}
        </button>

        {showHtml && (
          <button
            onClick={loadHtmlIntoEditor}
            className="px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
          >
            Load HTML into Editor
          </button>
        )}
      </div>

      <div>
        {showHtml ? (
          <textarea
            className="w-full h-[400px] p-4 border border-gray-300 rounded font-mono text-sm text-black bg-gray-200"
            value={htmlText}
            onChange={(e) => setHtmlText(e.target.value)}
          />
        ) : (
          <Editor
            editorState={editorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class border text-black border-gray-300 p-4 min-h-[400px]"
            onEditorStateChange={setEditorState}
          />
        )}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSave}
          className="bg-[#37c74f] hover:bg-[#28a23a] text-black font-semibold px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Content"}
        </button>

        <button
          onClick={() => {
            const previewWindow = window.open("", "_blank", "noopener,noreferrer");
            if (previewWindow) {
              previewWindow.document.write(htmlText || draftToHtml(convertToRaw(editorState.getCurrentContent())));
              previewWindow.document.close();
            }
          }}
          className="px-3 py-2 border rounded text-sm"
        >
          Open Preview
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Live preview from store content */}
      {content?.html && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2 text-black">Stored Preview:</h2>
          <div
            className="prose max-w-full text-[#494949]"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        </div>
      )}
    </div>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";

// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// import { useAppDispatch, useAppSelector } from "@/store";
// import {
//   fetchContent,
//   fetchAllContent,
//   saveContentThunk,
// } from "@/store/slice/contentSlice";

// import toast from "react-hot-toast";
// import PageHeader from "../common/PageHeader";


// // ✅ dynamic import CKEditor React component ONLY
// const CKEditor = dynamic(
//   () =>
//     import("@ckeditor/ckeditor5-react").then(
//       (mod) => mod.CKEditor
//     ),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="border p-4">
//         Loading editor...
//       </div>
//     ),
//   }
// );


// interface Props {
//   page: string;
// }

// function generateSlug(text: string) {
//   return text
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")   // remove special chars
//     .replace(/\s+/g, "-")       // spaces → dash
//     .replace(/--+/g, "-");      // multiple dash → single
// }

// export default function ContentEditor({ page }: Props) {

//   const dispatch = useAppDispatch();
//   const [slug, setSlug] = useState("");
//   const content = useAppSelector(
//     (state) => state.contents.contents[page]
//   );

//   const loading = useAppSelector(
//     (state) => state.contents.loading
//   );

//   const error = useAppSelector(
//     (state) => state.contents.error
//   );


//   const [title, setTitle] = useState(page);

//   const [html, setHtml] = useState("");

//   const [showHtml, setShowHtml] = useState(false);

//   const [editorLoaded, setEditorLoaded] = useState(false);


//   // ✅ ensure editor renders only client-side
//   useEffect(() => {
//     setEditorLoaded(true);
//   }, []);


//   // fetch content
//   useEffect(() => {

//     if (page) {
//       dispatch(fetchContent(page));
//     }

//   }, [page, dispatch]);


//   // populate editor
//   useEffect(() => {

//     if (content?.html) {

//       const loadedTitle = content.title || page;

//       setHtml(content.html);

//       setTitle(loadedTitle);

//       setSlug(generateSlug(loadedTitle));

//     }

//   }, [content, page]);



//   // ✅ Image upload adapter (Base64)
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   function uploadAdapter(loader: any) {

//     return {
//       upload: () =>
//         loader.file.then(
//           (file: File) =>
//             new Promise((resolve, reject) => {

//               const reader = new FileReader();

//               reader.onload = () => {

//                 resolve({
//                   default: reader.result,
//                 });

//               };

//               reader.onerror = reject;

//               reader.readAsDataURL(file);

//             })
//         ),
//     };

//   }


//   // ✅ register upload plugin properly
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   function uploadPlugin(editor: any) {

//     editor.plugins.get("FileRepository").createUploadAdapter =
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (loader: any) => {
//         return uploadAdapter(loader);
//       };

//   }


//   // save content
//   const handleSave = async () => {

//     if (!title) {
//       toast.error("Enter title");
//       return;
//     }

//     try {

//       const response = await dispatch(
//         saveContentThunk({
//           page: slug,
//           html,
//           title,
//         })
//       );

//       if (saveContentThunk.fulfilled.match(response)) {

//         toast.success("Saved successfully");

//         dispatch(fetchAllContent());

//       } else {

//         toast.error("Save failed");

//       }

//     } catch {

//       toast.error("Unexpected error");

//     }

//   };


//   return (

//     <div className="p-6">

//       <PageHeader
//         title={"New CMS Page"}
//         showAddButton={false}
//       />



//       {/* Title */}
//       <input
//         value={title}
//         onChange={(e) => {
//           const newTitle = e.target.value;
//           setTitle(newTitle);
//           setSlug(generateSlug(newTitle));
//         }}
//         className="border p-2 w-full text-black mb-2"
//         placeholder="Enter page title"
//       />

//       <input
//         value={slug}
//         readOnly
//         className="border p-2 w-full text-gray-500 mb-4 bg-gray-100"
//         placeholder="Slug auto-generated"
//       />


//       {/* Toggle HTML */}
//       <button
//         onClick={() =>
//           setShowHtml(!showHtml)
//         }
//         className="bg-green-500 text-white px-4 py-2 mb-4 rounded"
//       >
//         {showHtml
//           ? "Switch to Visual Editor"
//           : "Edit HTML"}
//       </button>



//       {/* Editor */}
//       {showHtml ? (

//         <textarea
//           value={html}
//           onChange={(e) =>
//             setHtml(e.target.value)
//           }
//           className="w-full h-96 border p-4 text-black"
//         />

//       ) : (

//         editorLoaded && (

//           <CKEditor
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             editor={ClassicEditor as unknown as any}
//             data={html}
//             config={{
//               extraPlugins: [uploadPlugin],

//               toolbar: [
//                 "heading",
//                 "|",
//                 "bold",
//                 "italic",
//                 "link",
//                 "bulletedList",
//                 "numberedList",
//                 "|",
//                 "imageUpload",
//                 "blockQuote",
//                 "insertTable",
//                 "undo",
//                 "redo",
//               ],

//               image: {
//                 toolbar: [
//                   "imageTextAlternative",
//                   "imageStyle:inline",
//                   "imageStyle:block",
//                   "imageStyle:side",
//                 ],
//               },
//             }}

//             onReady={(editor) => {

//               // ✅ Force light mode styles dynamically
//               const editable = editor.ui.view.editable.element;
//               const toolbar = editor.ui.view.toolbar.element;

//               if (editable) {
//                 editable.style.backgroundColor = "#ffffff";
//                 editable.style.color = "#000000";
//                 editable.style.minHeight = "400px";
//               }

//               if (toolbar) {
//                 toolbar.style.backgroundColor = "#f9fafb";
//                 toolbar.style.border = "1px solid #d1d5db";
//               }

//             }}

//             onChange={(event, editor) => {
//               const data = editor.getData();
//               setHtml(data);
//             }}
//           />

//         )

//       )}



//       {/* Save Button */}
//       <button
//         onClick={handleSave}
//         disabled={loading}
//         className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
//       >
//         {loading ? "Saving..." : "Save"}
//       </button>



//       {/* Preview */}
//       <div className="mt-6 border-t pt-4">

//         <h3 className="font-bold text-black text-xl mb-2">
//           Preview:
//         </h3>

//         <div
//           dangerouslySetInnerHTML={{
//             __html: html,
//           }}
//           className="text-black"
//         />

//       </div>



//       {/* Error */}
//       {/* {error && (
//         <p className="text-red-500 mt-2">
//           {error}
//         </p>
//       )} */}

//     </div>

//   );

// }
