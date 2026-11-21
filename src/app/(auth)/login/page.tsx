"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import "@/assets/styles/Login.css";

export default function LoginPage() {
  const router = useRouter();
  const { setIsLogin, fetchUser } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLogin(true);
        await fetchUser();
        toast.success("Logged in successfully");
        router.push(`/${data.username}`);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#4caf50] via-[#3e8e41] to-[#1b5e20] animate-gradient-xy">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-white/80 text-sm">Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Email / Username / Phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all pr-12"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4caf50] hover:bg-[#45a049] text-white font-bold rounded-lg py-3 shadow-lg transition-all duration-300 cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/20"></div>
          <span className="px-3 text-sm text-white/60 font-semibold">OR</span>
          <div className="flex-1 border-t border-white/20"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg py-3 shadow-lg transition-all duration-300 cursor-pointer"
        >
          <FcGoogle size={22} />
          <span>Login with Google</span>
        </button>

        <div className="text-center pt-4 border-t border-white/10 mt-6">
          <p className="text-sm text-white/70">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-white font-bold hover:underline underline-offset-4"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
