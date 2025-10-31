"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useAppDispatch } from "@/store";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { createBlog, updateBlog } from "@/store/slice/blogsSlice";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Editor = dynamic<import("react-draft-wysiwyg").EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const BlogSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  content: Yup.string().trim(),
  summary: Yup.string().trim().max(300, "Summary can’t exceed 300 characters"),
  coverImage: Yup.string().url("Enter a valid image URL").nullable(),
  isActive: Yup.boolean(),
});

interface BlogEditorProps {
  blogId?: string;
}

export default function BlogEditor({ blogId }: BlogEditorProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showHtml, setShowHtml] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  useEffect(() => setIsClient(true), []);

  // ✅ Load existing blog if editing
  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await api({ url: `/admin/blogs/${blogId}`, method: "GET" });
        if (!res.blog) {
          toast.error("Blog not found");
          return;
        }

        const blog = res.blog;
        setData(blog);

        if (blog.content) {
          const blocks = htmlToDraft(blog.content);
          const contentState = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch {
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (!isClient) return <div className="p-6 text-gray-600">Loading editor...</div>;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: data?.title || "",
        content: data?.content || "",
        summary: data?.summary || "",
        coverImage: data?.coverImage || "",
        isActive: data?.isActive ?? false,
      }}
      validationSchema={BlogSchema}
      onSubmit={async (values, { resetForm }) => {
        const htmlContent = showHtml
          ? values.content
          : draftToHtml(convertToRaw(editorState.getCurrentContent())).trim();

        if (!htmlContent) {
          toast.error("Content is required");
          return;
        }

        const payload = {
          title: values.title.trim(),
          content: htmlContent,
          coverImage: values.coverImage || undefined,
          summary: values.summary || undefined,
          isActive: values.isActive,
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
            resetForm();
            router.back();
          } else {
            toast.error("Failed to save blog");
          }
        } catch (err) {
          toast.error(
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="text-yellow-600 text-xl" />
              <span>{err instanceof Error ? err.message : "Unexpected error"}</span>
            </div>
          );
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="p-6 max-w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-[#16325d]">
              {blogId ? "Edit Blog" : "Add Blog"}
            </h1>
            <button
              type="button"
              onClick={() => setShowHtml((p) => !p)}
              className="px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
            >
              {showHtml ? "Switch to Editor" : "Edit HTML"}
            </button>
          </div>

          {/* Title */}
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-800">
              Title<span className="text-red-600">*</span>
            </label>
            <Field
              name="title"
              placeholder="Enter blog title..."
              className="border text-black p-2 w-full rounded"
            />
            <ErrorMessage name="title" component="p" className="text-red-600 text-sm mt-1" />
          </div>

          {/* Short Summary */}
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-800">Short Summary</label>
            <Field
              as="textarea"
              name="summary"
              placeholder="Short summary of your blog..."
              className="border text-black p-2 w-full rounded"
            />
            <ErrorMessage name="summary" component="p" className="text-red-600 text-sm mt-1" />
          </div>

          {/* Editor / HTML */}
          {showHtml ? (
            <textarea
              value={values.content}
              onChange={(e) => setFieldValue("content", e.target.value)}
              className="border p-4 w-full h-[400px] rounded font-mono bg-gray-100 text-black"
            />
          ) : (
            <Editor
              editorState={editorState}
              onEditorStateChange={(state) => {
                setEditorState(state);
                const html = draftToHtml(convertToRaw(state.getCurrentContent()));
                setFieldValue("content", html);
              }}
              editorClassName="border p-4 min-h-[400px] text-black rounded bg-white"
            />
          )}
          <ErrorMessage name="content" component="p" className="text-red-600 text-sm mt-1" />

          {/* Cover Image */}
          {/* Cover Image */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-800">
              Cover Image URL
            </label>
            <div className="flex items-center gap-2">
              <Field
                name="coverImage"
                placeholder="https://example.com/image.jpg"
                className="border text-black p-2 w-full rounded"
              />
              {/* Dummy Browse Button */}
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      toast.success(`Selected: ${file.name}`);
                    }
                  };
                  input.click();
                }}
                className="bg-green-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
              >
                Browse
              </button>
            </div>
            <ErrorMessage
              name="coverImage"
              component="p"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Toggle */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm text-gray-700">Status:</span>
            <button
              type="button"
              onClick={() => setFieldValue("isActive", !values.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${values.isActive ? "bg-green-500" : "bg-gray-300"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${values.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
            <span className="text-sm text-gray-800">{values.isActive ? "Active" : "Inactive"}</span>
          </div>

          {/* Submit Button below toggle */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#37c74f] hover:bg-[#28a23a] text-black font-semibold px-4 py-2 rounded"
            >
              {loading ? "Saving..." : blogId ? "Update Blog" : "Add Blog"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
