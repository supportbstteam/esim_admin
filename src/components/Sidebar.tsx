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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/store/slice/userSlice";

import { MdOutlineMobileFriendly, MdOutlinePermMedia } from "react-icons/md";
import { FiAirplay } from "react-icons/fi";
import { BiBlanket } from "react-icons/bi";
import { FaQuoteLeft } from "react-icons/fa";
import { AiFillApi } from "react-icons/ai";
import { TbDeviceIpadPlus } from "react-icons/tb";

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: any = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  const navItems = [
    { href: "/admin/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/admin/customers", icon: <Users size={20} />, label: "Customers" },
    { href: "/admin/country", icon: <FiAirplay size={20} />, label: "Country" },
    { href: "/admin/plans", icon: <Layers size={20} />, label: "Plans" },
    {
      href: "/admin/topup",
      icon: <MdOutlineMobileFriendly size={20} />,
      label: "Top Up",
    },
    {
      href: "/admin/orders",
      icon: <FileText size={20} />,
      label: "Orders",
      subItems: [
        {
          href: "/admin/orders/plans",
          label: "Plans",
          icon: <LucideSatellite size={18} />,
        },
        {
          href: "/admin/orders/top-up",
          label: "Top-up",
          icon: <CreditCard size={18} />,
        },
        { href: "/admin/esim", icon: <Cpu size={18} />, label: "E-Sims" },
      ],
    },
    {
      href: "/admin/compatible",
      icon: <AiFillApi size={20} />,
      label: "Compatiblity",
      subItems: [
        {
          href: "/admin/compatible/brands",
          label: "Brands",
          icon: <LucideSatellite size={18} />,
        },
        {
          href: "/admin/compatible/devices",
          icon: <TbDeviceIpadPlus size={18} />,
          label: "Devices",
        },
      ],
    },
    {
      href: "/admin/content",
      icon: <LucideWorkflow size={20} />,
      label: "CMS",
    },
    {
      href: "/admin/media",
      icon: <MdOutlinePermMedia size={20} />,
      label: "Media",
    },
    {
      href: "/admin/testimonials",
      icon: <BiBlanket size={20} />,
      label: "Testimonials",
    },
    { href: "/admin/faqs", icon: <FaQuoteLeft size={20} />, label: "Faqs" },
    {
      href: "/admin/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside
      className={`h-full bg-gray-800 shadow-lg flex flex-col 
      transition-[width] duration-200 ease-in-out
      ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* LOGO */}
      <div className="pt-4 border-b border-gray-700">
        <Image
          src="/FullLogo.png"
          alt="Logo"
          width={collapsed ? 40 : 150}
          height={collapsed ? 40 : 150}
          className="mx-auto mb-4 rounded-2xl"
        />
      </div>

      {/* NAV */}
      <nav className="flex-1 p-2 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <div key={item.href}>
            <div
              className={`flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer transition
                ${
                  isActive(item.href)
                    ? "bg-gray-500 text-white"
                    : "text-white hover:bg-gray-700"
                }`}
              onClick={() =>
                item.subItems ? toggleMenu(item.href) : router.push(item.href)
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.subItems && (
                <div>
                  {openMenus[item.href] ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </div>
              )}
            </div>

            {/* SUB MENU */}
            {!collapsed && item.subItems && openMenus[item.href] && (
              <div className="pl-6 flex flex-col mt-1 space-y-1">
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm transition
                      ${
                        isActive(sub.href)
                          ? "bg-gray-500 text-white"
                          : "text-white hover:bg-gray-700"
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

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}