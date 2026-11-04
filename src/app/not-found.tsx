import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full border border-gray-100">
        <h1 className="text-8xl font-extrabold text-[#4caf50] mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Page not found.
        </h2>

        <p className="text-gray-600 mb-6 text-sm">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>

        <Link
          href="/"
          className="inline-block bg-[#4caf50] text-white font-medium py-2.5 px-6 rounded-full transition-transform transform hover:scale-105 hover:shadow-lg"
        >
          Go Home
        </Link>
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} | PB Expense Tracker
      </p>
    </div>
  );
}
