// app/admin/users/manage/page.tsx
import React, { Suspense } from "react";
import CreateOrUpdate from "./CreateOrUpdate";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <CreateOrUpdate />
    </Suspense>
  );
}
