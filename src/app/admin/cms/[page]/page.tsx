"use client";

import ContentEditor from "@/components/editor/TextEditor";

export default function DynamicPage({ params }: { params: { page: string } }) {
  return (
    <div className="p-6">
      {/* <ContentEditor page={params.page} /> */}
    </div>
  );
}
