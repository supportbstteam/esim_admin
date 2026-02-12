"use client";

import ContentEditor from "@/components/editor/TextEditor";
import CreateCMS from "./CMSEditor";

export default function CMSDynamicPage({ params }: { params: { page: string } }) {
  return (
    <div className="p-6">
      <CreateCMS />
    </div>
  );
}
