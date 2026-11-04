"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { IoIosAnalytics } from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  handleCloseArrowClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, handleCloseArrowClick }) => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="fixed left-0 top-0 h-full w-[70px] bg-[#4caf50] p-2 flex items-center justify-center">
        <p className="text-white text-xs">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className={`p-2 fixed bg-[#4caf50] h-full overflow-hidden ${
        isOpen ? "w-[250px]" : "w-[70px]"
      } left-0 top-0 transition-[width] duration-300 ease-in-out z-40 shadow-xl`}
    >
      <FaArrowLeftLong
        className={`absolute top-4 right-3.5 cursor-pointer text-white text-lg transition-transform duration-300 ${
          !isOpen ? "rotate-180" : ""
        }`}
        onClick={handleCloseArrowClick}
      />

      <Link
        className={`flex gap-x-3 pt-10 items-center ${
          !isOpen ? "justify-center" : "justify-start px-2"
        }`}
        href={`/${user.username}`}
      >
        <div className="w-8 h-8 flex-shrink-0 relative">
          <Image
            src="/images/exp-favicon.png"
            alt="Logo"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <h2
          className={`text-white font-bold text-lg text-nowrap whitespace-nowrap overflow-hidden ${
            !isOpen ? "hidden" : "block"
          }`}
        >
          PB Expense Tracker
        </h2>
      </Link>

      <div className="pt-6 flex flex-col gap-y-2">
        <Link
          className={`text-white text-base items-center flex gap-x-4 py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors ${
            !isOpen ? "justify-center px-0" : "justify-start"
          }`}
          href={`/${user.username}`}
          title="Dashboard"
        >
          <MdOutlineSpaceDashboard className="text-2xl flex-shrink-0" />
          <span className={`${!isOpen ? "hidden" : "block font-medium"}`}>
            Dashboard
          </span>
        </Link>

        <Link
          className={`text-white text-base items-center flex gap-x-4 py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors ${
            !isOpen ? "justify-center px-0" : "justify-start"
          }`}
          href={`/${user.username}/analytics`}
          title="Analytics"
        >
          <IoIosAnalytics className="text-2xl flex-shrink-0" />
          <span className={`${!isOpen ? "hidden" : "block font-medium"}`}>
            Analytics
          </span>
        </Link>

        <Link
          className={`text-white text-base items-center flex gap-x-4 py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors ${
            !isOpen ? "justify-center px-0" : "justify-start"
          }`}
          href={`/${user.username}/add-expense`}
          title="Add Expense"
        >
          <FaCirclePlus className="text-xl flex-shrink-0" />
          <span className={`${!isOpen ? "hidden" : "block font-medium"}`}>
            Add Expense
          </span>
        </Link>

        <Link
          className={`text-white text-base items-center flex gap-x-4 py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors ${
            !isOpen ? "justify-center px-0" : "justify-start"
          }`}
          href={`/${user.username}/reports`}
          title="Reports"
        >
          <TbReportAnalytics className="text-2xl flex-shrink-0" />
          <span className={`${!isOpen ? "hidden" : "block font-medium"}`}>
            Reports
          </span>
        </Link>

        <button
          className={`text-white text-base items-center flex gap-x-4 py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-left w-full ${
            !isOpen ? "justify-center px-0" : "justify-start"
          }`}
          onClick={logout}
          title="Logout"
        >
          <FiLogOut className="text-xl flex-shrink-0" />
          <span className={`${!isOpen ? "hidden" : "block font-medium"}`}>
            Logout
          </span>
        </button>
      </div>

      <div
        className={`absolute bottom-0 pb-6 w-full ${
          !isOpen ? "left-0 flex justify-center" : "left-0 px-4"
        }`}
      >
        <Link
          href={`/${user.username}/profile`}
          className={`text-white text-sm items-center flex gap-x-3 py-2 px-2 rounded-lg hover:bg-white/10 transition-colors ${
            !isOpen ? "justify-center" : "justify-start"
          }`}
          title="Profile"
        >
          <FaUserCircle className="text-2xl flex-shrink-0" />
          <span
            className={`font-medium truncate ${
              !isOpen ? "hidden" : "inline-block max-w-[170px]"
            }`}
          >
            {user.fullName}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
