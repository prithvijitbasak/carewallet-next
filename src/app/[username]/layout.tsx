"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
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
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <div className="text-[#4caf50] text-xl font-semibold animate-pulse">
          Loading CareWallet...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        handleCloseArrowClick={handleCloseArrowClick}
      />
      <main
        className={`${
          isSidebarOpen ? "ml-[250px]" : "ml-[70px]"
        } flex-1 p-4 md:p-8 transition-[margin-left] duration-300 min-w-0 bg-[#f8fafc]`}
      >
        {children}
      </main>
    </div>
  );
}
