"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { isLogin, user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#e8f5e9] to-white text-gray-800">
      {/* Navbar */}
      <header className="w-full bg-white shadow-md py-4 px-4 sm:px-6 flex justify-between items-center fixed top-0 z-50">
        <h1 className="text-xl sm:text-2xl font-bold text-[#4caf50]">
          Expense Tracker
        </h1>

        <nav className="space-x-3 sm:space-x-4 flex items-center">
          {isLogin && user ? (
            <Link
              href={`/${user.username}`}
              className="font-medium text-[#4caf50] hover:underline text-sm sm:text-base"
            >
              {user.fullName || "My Profile"}
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4caf50] text-white rounded-full hover:bg-[#43a047] transition-all duration-300 text-sm sm:text-base font-medium"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-[#4caf50] text-[#4caf50] rounded-full hover:bg-[#4caf50] hover:text-white transition-all duration-300 text-sm sm:text-base font-medium"
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow mt-24 px-4 sm:px-6 md:px-16 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2e7d32] mb-4 sm:mb-6">
            Take Control of Your Finances
          </h2>

          <p className="text-gray-600 text-base sm:text-lg mb-8 sm:mb-10 px-2 sm:px-0">
            Effortlessly track your daily, monthly, and yearly expenses.
            Visualize where your money goes and stay ahead of your budget goals.
          </p>

          {!isLogin || !user ? (
            <div className="flex justify-center gap-3 sm:gap-4">
              <Link
                href="/register"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#4caf50] text-white rounded-full font-semibold hover:bg-[#43a047] transition-all duration-300 text-sm sm:text-base"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-5 sm:px-6 py-2.5 sm:py-3 border border-[#4caf50] text-[#4caf50] rounded-full font-semibold hover:bg-[#4caf50] hover:text-white transition-all duration-300 text-sm sm:text-base"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <Link
                href={`/${user.username}`}
                className="px-6 py-3 bg-[#4caf50] text-white rounded-full font-semibold hover:bg-[#43a047] transition-all duration-300"
              >
                Go To Dashboard
              </Link>
            </div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
            <h3 className="text-lg sm:text-xl font-semibold text-[#4caf50] mb-2 sm:mb-3">
              💰 Smart Expense Insights
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Get detailed analysis and graphical reports of your spending
              patterns.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
            <h3 className="text-lg sm:text-xl font-semibold text-[#4caf50] mb-2 sm:mb-3">
              📅 Track Anytime
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Easily view your day, month, or yearly expense details — all in
              one place.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
            <h3 className="text-lg sm:text-xl font-semibold text-[#4caf50] mb-2 sm:mb-3">
              📊 Visualize Data
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Interactive charts make budgeting not just useful — but fun and
              intuitive.
            </p>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          className="mt-16 sm:mt-20 bg-[#f1f8e9] rounded-2xl p-6 sm:p-8 shadow-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-[#2e7d32] mb-4">
            Why Choose Expense Tracker?
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Designed for simplicity and performance, this Expense Tracker helps
            you build a financial habit you’ll love. Whether you&apos;re saving
            for a goal or monitoring daily spending, our tool gives you clarity
            and control in just a few clicks.
          </p>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 border-t mt-10 text-sm bg-white px-4">
        <p>
          © {currentYear} | Developed by{" "}
          <a
            href="https://prithvijitbasak.netlify.app/"
            className="text-[#4caf50] font-medium hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Prithvijit Basak
          </a>
        </p>
      </footer>
    </div>
  );
}
