// app/admin/users/manage/page.tsx
import React, { Suspense } from "react";
import FaqCreate from "./FaqCreate";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <FaqCreate />
    </Suspense>
  );
}
