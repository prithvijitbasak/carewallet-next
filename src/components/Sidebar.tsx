"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  PlusCircle,
  FileSpreadsheet,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  handleCloseArrowClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, handleCloseArrowClick }) => {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <aside
        className={`fixed left-0 top-0 h-full ${
          isOpen ? "w-[250px]" : "w-[70px]"
        } bg-white border-r border-gray-100 z-40 p-3 flex flex-col justify-between`}
      >
        <div className="space-y-4">
          <div className="h-10 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-2 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="h-12 bg-gray-50 rounded-xl animate-pulse" />
      </aside>
    );
  }

  if (!user) {
    return null;
  }

  const baseUserPath = `/${user.username}`;

  const navItems = [
    {
      label: "Dashboard",
      href: baseUserPath,
      icon: LayoutDashboard,
      isActive:
        pathname === baseUserPath ||
        pathname?.startsWith(`${baseUserPath}/day-details`) ||
        pathname?.startsWith(`${baseUserPath}/month-details`) ||
        pathname?.startsWith(`${baseUserPath}/year-details`),
    },
    {
      label: "Analytics",
      href: `${baseUserPath}/analytics`,
      icon: BarChart3,
      isActive: pathname?.startsWith(`${baseUserPath}/analytics`),
    },
    {
      label: "Add Expense",
      href: `${baseUserPath}/add-expense`,
      icon: PlusCircle,
      isActive: pathname?.startsWith(`${baseUserPath}/add-expense`),
    },
    {
      label: "Reports",
      href: `${baseUserPath}/reports`,
      icon: FileSpreadsheet,
      isActive: pathname?.startsWith(`${baseUserPath}/reports`),
    },
  ];

  const isProfileActive = pathname?.startsWith(`${baseUserPath}/profile`);
  const userInitial = (user.fullName || user.username || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <aside
      className={`fixed left-0 top-0 h-full ${
        isOpen ? "w-[250px]" : "w-[70px]"
      } bg-white border-r border-gray-200/80 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-[1px_0_12px_rgba(0,0,0,0.03)] select-none`}
    >
      {/* Brand Header */}
      <div>
        <div
          className={`h-20 px-3 flex items-center border-b border-gray-100/90 relative ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          <Link
            href={baseUserPath}
            className="flex items-center gap-3 overflow-hidden group"
            title="CareWallet"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center p-2 flex-shrink-0 shadow-xs transition-transform group-hover:scale-105">
              <Image
                src="/images/exp-favicon.png"
                alt="CareWallet Logo"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            {isOpen && (
              <div className="min-w-0 flex flex-col">
                <span className="font-extrabold text-gray-900 text-base tracking-tight leading-tight">
                  Care<span className="text-[#4caf50]">Wallet</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-600/90 uppercase tracking-wider">
                  Expense Tracker
                </span>
              </div>
            )}
          </Link>

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={handleCloseArrowClick}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={`w-7 h-7 rounded-full bg-white hover:bg-emerald-50 text-gray-400 hover:text-[#4caf50] border border-gray-200/90 hover:border-emerald-200 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
              !isOpen
                ? "absolute -right-3.5 top-6.5 z-50 bg-white shadow-sm"
                : ""
            }`}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${
                !isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-5 pb-3">
          {isOpen && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2.5">
              Menu
            </p>
          )}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`group relative flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all duration-200 text-sm font-medium ${
                    !isOpen ? "justify-center px-0" : "justify-start"
                  } ${
                    item.isActive
                      ? "bg-emerald-50 text-[#2e7d32] font-semibold shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/90"
                  }`}
                >
                  {/* Subtle active accent indicator */}
                  {item.isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#4caf50]" />
                  )}

                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      item.isActive
                        ? "text-[#4caf50]"
                        : "text-gray-400 group-hover:text-gray-700"
                    }`}
                  />

                  {isOpen && (
                    <span className="truncate leading-none">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Area: User Profile & Logout */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50 space-y-1.5">
        {/* Profile Card */}
        <Link
          href={`${baseUserPath}/profile`}
          title={`Profile (${user.fullName || user.username})`}
          className={`group flex items-center gap-3 p-2 rounded-2xl transition-all duration-200 ${
            !isOpen ? "justify-center" : "justify-start"
          } ${
            isProfileActive
              ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
              : "hover:bg-white text-gray-700 hover:shadow-xs"
          }`}
        >
          <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-emerald-500/20 bg-gradient-to-br from-[#4caf50] to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {user.image?.data ? (
              <img
                src={`data:${user.image.contentType};base64,${user.image.data}`}
                alt={user.fullName || "User Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{userInitial}</span>
            )}
          </div>

          {isOpen && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 truncate leading-tight group-hover:text-[#4caf50] transition-colors">
                {user.fullName || user.username}
              </p>
              <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">
                @{user.username}
              </p>
            </div>
          )}
        </Link>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Logout"
          className={`w-full group flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200 cursor-pointer text-xs font-medium ${
            !isOpen ? "justify-center px-0" : "justify-start"
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-red-500 transition-transform group-hover:-translate-x-0.5" />
          {isOpen && <span className="leading-none">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
