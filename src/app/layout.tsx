/**
 * ============================================================================
 * ROOT APPLICATION LAYOUT (`/layout.tsx`)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * 1. What is RootLayout?
 *    In Next.js App Router, `RootLayout` is the top-level parent wrapper around every
 *    single page in the application. It defines the `<html>` and `<body>` tags.
 * 
 * 2. Next.js Font Optimization:
 *    The `Geist` and `Geist_Mono` fonts are downloaded at build time and self-hosted,
 *    eliminating layout shifts (CLS) and external Google Font network calls.
 * 
 * 3. Global Providers:
 *    The `<Providers>` component injects React Query Client, Redux Store, and Toastify
 *    notifications across the entire component tree.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PB Expense Tracker",
  description: "Track your day-to-day expenses easily and effectively",
  icons: {
    icon: "/images/exp-favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-[#f4f4f4] text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
