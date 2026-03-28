"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const titleMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/customers": "Customers",
  "/admin/country": "Country",
  "/admin/plans": "Plans",
  "/admin/topup": "Top Up",
  "/admin/orders": "Orders",
  "/admin/compatible": "Compatibility",
  "/admin/content": "CMS",
  "/admin/media": "Media",
  "/admin/testimonials": "Testimonials",
  "/admin/faqs": "Faqs",
  "/admin/settings": "Settings",
};

export default function PageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const match = Object.keys(titleMap).find((route) =>
      pathname.startsWith(route)
    );

    const title = match ? titleMap[match] : "Admin Panel";

    document.title = title;
  }, [pathname]);

  return null;
}