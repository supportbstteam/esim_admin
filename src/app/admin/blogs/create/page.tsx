export const dynamic = "force-dynamic";
export const revalidate = false; // ✅ must be false (not 0)
export const fetchCache = "force-no-store";

import CreateBlogClient from "./CreateBlogClient";

export default function CreateBlogPage() {
  return <CreateBlogClient />;
}
