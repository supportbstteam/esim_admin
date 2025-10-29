"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useAppDispatch } from "@/store";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { createBlog, updateBlog } from "@/store/slice/blogsSlice";
import { api } from "@/lib/api";

// ✅ Proper dynamic import with types + SSR disabled
const Editor = dynamic<import("react-draft-wysiwyg").EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

interface BlogEditorProps {
  blogId?: string;
}

export default function BlogEditor({ blogId }: BlogEditorProps) {
  const dispatch = useAppDispatch();

  const [isClient, setIsClient] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlText, setHtmlText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // ✅ Ensure rendering only on client (prevents window undefined)
  useEffect(() => setIsClient(true), []);

  // ✅ Fetch blog if editing
  useEffect(() => {
    if (!blogId) return;

    const fetchBlogById = async () => {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await api({
          url: `/admin/blogs/${blogId}`,
          method: "GET",
        });

        if (!res.blog) {
          toast.error("Blog not found.");
          return;
        }

        const blog = res.blog;
        setTitle(blog.title || "");
        setExcerpt(blog.excerpt || "");
        setCoverImage(blog.coverImage || "");
        setCategory(blog.category || "");
        setIsActive(blog.isActive || false);

        if (blog.content) {
          const blocks = htmlToDraft(blog.content);
          const contentState = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
          setEditorState(EditorState.createWithContent(contentState));
          setHtmlText(blog.content);
        }
      } catch (err) {
        console.error("Error loading blog:", err);
        toast.error("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogById();
  }, [blogId]);

  // ✅ Save handler
  const handleSave = async () => {
    const html = showHtml ? htmlText : draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (!title.trim()) {
      toast.error("Please enter a blog title.");
      return;
    }

    const payload = {
      title: title.trim(),
      content: html,
      coverImage: coverImage || undefined,
      category: category || undefined,
      isActive: isActive || false,
    };

    try {
      setLoading(true);
      const response = blogId
        ? await dispatch(updateBlog({ id: blogId, data: payload }))
        : await dispatch(createBlog(payload));

      if (response.meta.requestStatus === "fulfilled") {
        toast.success(
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-green-600 text-xl" />
            <span>Blog {blogId ? "updated" : "created"} successfully!</span>
          </div>
        );
      } else {
        toast.error(
          <div className="flex items-center gap-2">
            <FiXCircle className="text-red-600 text-xl" />
            <span>Failed to save blog.</span>
          </div>
        );
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error(
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="text-yellow-600 text-xl" />
          <span>{err instanceof Error ? err.message : "Unexpected error"}</span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Don’t render the editor until on client (avoids window undefined)
  if (!isClient) {
    return <div className="p-6 text-gray-600">Loading editor...</div>;
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-[#16325d]">
          {blogId ? "Edit Blog" : "Create Blog"}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHtml((p) => !p)}
            className="px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
          >
            {showHtml ? "Switch to Editor" : "Edit HTML"}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#37c74f] hover:bg-[#28a23a] text-black font-semibold px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title..."
          className="border text-black p-2 w-full rounded"
        />
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category (optional)..."
          className="border text-black p-2 w-full rounded"
        />
      </div>

      {/* HTML Editor / Raw HTML */}
      {showHtml ? (
        <textarea
          value={htmlText}
          onChange={(e) => setHtmlText(e.target.value)}
          className="border p-4 w-full h-[400px] rounded font-mono bg-gray-100 text-black"
        />
      ) : (
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          editorClassName="border p-4 min-h-[400px] text-black rounded"
        />
      )}

      {/* Cover Image */}
      <div className="mt-3">
        <label className="block text-black text-sm font-medium text-gray-700">Cover Image URL</label>
        <input
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Excerpt */}
      <div className="mt-3">
        <label className="block text-black text-sm font-medium text-gray-700">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary of your blog..."
          className="border text-black p-2 w-full rounded"
        />
      </div>

      {/* Active / Publish */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <span className="text-sm text-gray-700">Published</span>
      </div>
    </div>
  );
}
