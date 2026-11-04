"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, loading, isLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLogin) {
      router.push("/login");
    }
  }, [loading, isLogin, router]);

  const handleCloseArrowClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4f4f4]">
        <div className="text-[#4caf50] text-xl font-semibold animate-pulse">
          Loading PB Expense Tracker...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f4f4f4] text-gray-900">
      <div className="flex flex-1 bg-[#f4f4f4]">
        <Sidebar
          isOpen={isSidebarOpen}
          handleCloseArrowClick={handleCloseArrowClick}
        />
        <main
          className={`${
            isSidebarOpen ? "ml-[250px]" : "ml-[70px]"
          } flex-1 p-4 md:p-6 transition-[margin-left] duration-300 min-w-0 bg-[#f4f4f4]`}
        >
          {children}
        </main>
      </div>
      <div
        className={`${
          isSidebarOpen ? "ml-[250px]" : "ml-[70px]"
        } transition-[margin-left] duration-300`}
      >
        <Footer />
      </div>
    </div>
  );
}
