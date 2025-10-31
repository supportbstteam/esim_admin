// app/admin/users/manage/page.tsx
import React, { Suspense } from "react";
import TestMonialCreate from "./TestMonialCreate";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <TestMonialCreate />
    </Suspense>
  );
}
