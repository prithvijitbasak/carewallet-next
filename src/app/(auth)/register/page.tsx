// Registration page with timezone detection, validation, and auto-login

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import "@/assets/styles/Login.css";

export default function RegisterPage() {
  const { setIsLogin, fetchUser } = useAuth();
  const router = useRouter();

  const [registeredUser, setRegisteredUser] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Normal user",
    timezone: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisteredUser({ ...registeredUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate that password and confirm password match
    if (registeredUser.password !== registeredUser.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Automatically detect the user's browser timezone
    const detectedTimezone =
      registeredUser.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "Asia/Kolkata";

    const payload = {
      fullName: registeredUser.fullName,
      username: registeredUser.username.toLowerCase(),
      email: registeredUser.email,
      phone: registeredUser.phone,
      password: registeredUser.password,
      role: registeredUser.role || "Normal user",
      timezone: detectedTimezone,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const res_data = await response.json();

      if (response.ok) {
        setIsLogin(true);
        await fetchUser();
        toast.success("Registration successful");
        router.push(`/${res_data.username}`);
      } else {
        setError(res_data.message || "Registration failed. Try again.");
        toast.error(res_data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration failed", err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#4caf50] via-[#3e8e41] to-[#1b5e20] animate-gradient-xy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-white mb-2">Create Account</h3>
          <p className="text-white/80 text-sm">Join our community today</p>
        </div>

        <p className="text-[10px] text-right mb-2 uppercase tracking-widest text-white/60 font-bold">
          All fields required
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <motion.div whileTap={{ scale: 0.995 }}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={registeredUser.fullName}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all"
            />
          </motion.div>

          {/* Username */}
          <div className="relative group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={registeredUser.username}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-help text-white/50 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            {/* Tooltip hint for username constraints */}
            <div className="absolute left-0 -top-12 hidden group-hover:block bg-gray-900/90 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 whitespace-nowrap z-50">
              Only lowercase letters and numbers allowed.
            </div>
          </div>

          {/* Email */}
          <motion.div whileTap={{ scale: 0.995 }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={registeredUser.email}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all"
            />
          </motion.div>

          {/* Phone */}
          <motion.div whileTap={{ scale: 0.995 }}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (10 digits)"
              value={registeredUser.phone}
              onChange={handleInput}
              required
              maxLength={10}
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all"
            />
          </motion.div>

          {/* Password */}
          <div className="relative group">
            <input
              type={viewPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={registeredUser.password}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all pr-12"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
              onClick={() => setViewPassword(!viewPassword)}
              title={viewPassword ? "Hide password" : "Show password"}
            >
              {viewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
            {/* Tooltip hint for password security rules */}
            <div className="absolute left-0 -top-16 hidden group-hover:block bg-gray-900/90 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 z-50">
              Min 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={viewConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={registeredUser.confirmPassword}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all pr-12"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
              onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
              title={viewConfirmPassword ? "Hide password" : "Show password"}
            >
              {viewConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </span>
          </div>

          {/* Validation Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-200 text-xs bg-red-500/20 p-2.5 rounded-lg border border-red-500/30 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#4caf50] hover:bg-[#45a049] text-white font-bold rounded-lg py-3 shadow-lg transition-all duration-300 mt-2 cursor-pointer"
          >
            Sign Up
          </motion.button>

          {/* Redirect to Login */}
          <div className="text-center pt-2">
            <p className="text-sm text-white/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white font-bold hover:underline underline-offset-4"
              >
                Log In
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
