"use client";

import {
  Home,
  Users,
  Layers,
  Settings,
  Cpu,
  FileText,
  CreditCard,
  ChevronDown,
  ChevronRight,
  LucideSatellite,
  LucideWorkflow,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "@/store/slice/userSlice";
import { MdOutlineMobileFriendly } from "react-icons/md";
import { FiAirplay } from "react-icons/fi";
import { BsCardHeading } from "react-icons/bs";
import { BiBlanket } from "react-icons/bi";
import { FaQuoteLeft } from "react-icons/fa";
import { AiFillApi } from "react-icons/ai";
import { TbDeviceIpadPlus } from "react-icons/tb";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: any = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.user);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleLogout = async () => {
    await dispatch(logout());
    await dispatch(checkAuth());
    router.push("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(checkAuth());
    };
    fetchUser();
  }, []);

  // Extract section & subpage for breadcrumb
  const { sectionTitle, subTitle } = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    let section = "";
    let sub = "";
    if (parts.length >= 2) section = parts[1];
    if (parts.length > 2 && parts[2] !== "page") sub = parts[2];
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return { sectionTitle: capitalize(section), subTitle: sub ? capitalize(sub) : "" };
  }, [pathname]);

  const navItems = [
    { href: "/admin/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/admin/customers", icon: <Users size={20} />, label: "Customers" },
    { href: "/admin/country", icon: <FiAirplay size={20} />, label: "Country" },
    { href: "/admin/plans", icon: <Layers size={20} />, label: "Plans" },
    { href: "/admin/topup", icon: <MdOutlineMobileFriendly size={20} />, label: "Top Up" },
    {
      href: "/admin/orders",
      icon: <FileText size={20} />,
      label: "Orders",
      subItems: [
        { href: "/admin/orders/plans", label: "Plans", icon: <LucideSatellite size={18} /> },
        { href: "/admin/orders/top-up", label: "Top-up", icon: <CreditCard size={18} /> },
        { href: "/admin/esim", icon: <Cpu size={18} />, label: "E-Sims" },
      ],
    },
    {
      href: "/admin/compatible",
      icon: <AiFillApi size={20} />,
      label: "Compatiblity",
      subItems: [
        { href: "/admin/compatible/brands", label: "Brands", icon: <LucideSatellite size={18} /> },
        { href: "/admin/compatible/devices", icon: <TbDeviceIpadPlus size={18} />, label: "Devices" },
      ],
    },
    { href: "/admin/cms", icon: <LucideWorkflow size={20} />, label: "CMS" },
    { href: "/admin/blogs", icon: <BsCardHeading size={20} />, label: "Blogs" },
    { href: "/admin/testimonials", icon: <BiBlanket size={20} />, label: "Testimonials" },
    { href: "/admin/faqs", icon: <FaQuoteLeft size={20} />, label: "Faqs" },
    { href: "/admin/settings", icon: <Settings size={20} />, label: "Settings" },
    { href: "/admin/content", icon: <Settings size={20} />, label: "CMS2" },
  ];

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="w-64 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="pt-2 border-b dark:border-gray-700">
        <Image
          src="/FullLogo.png"
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto mb-4 rounded-2xl"
        />
        <div className="px-4 pb-2">
          <h3 className="text-gray-700 dark:text-gray-300 font-bold">{sectionTitle}</h3>
          {subTitle && <p className="text-gray-500 dark:text-gray-400 text-sm">{subTitle}</p>}
        </div>
      </div>

      {/* ✅ Scrollable nav with hidden scrollbar */}
      <nav
        className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar"
      >
        {navItems.map((item) => (
          <div key={item.href}>
            <div
              className={`flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer transition 
                ${isActive(item.href)
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={() => (item.subItems ? toggleMenu(item.href) : router.push(item.href))}
            >
              <div className="flex items-center gap-3">
                {item.icon} {item.label}
              </div>
              {item.subItems && (
                <div>
                  {openMenus[item.href] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              )}
            </div>
            {item.subItems && openMenus[item.href] && (
              <div className="pl-6 flex flex-col mt-1 space-y-1">
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm transition
                      ${isActive(sub.href)
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    {sub.icon} {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ✅ Logout Button fixed at bottom */}
      {/* <div className="border-t dark:border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div> */}

      {/* ✅ Hidden scrollbar styling */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </aside>
  );
}
