"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import "@/assets/styles/Login.css";

export default function LoginPage() {
  const { setIsLogin, user, isLogin, fetchUser } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState({
    identifier: "",
    password: "",
  });
  const [viewPassword, setViewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLogin && user?.username) {
      router.push(`/${user.username}`);
    }
  }, [isLogin, user, router]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoggedInUser({
      ...loggedInUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loggedInUser),
      });

      const res_data = await response.json();
      if (response.ok) {
        setLoggedInUser({ identifier: "", password: "" });
        setIsLogin(true);
        await fetchUser();
        toast.success("Logged in successfully");
        router.push(`/${res_data.username}`);
      } else {
        toast.error(res_data.message || "Invalid credentials");
        setLoggedInUser((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Incorrect login format entered");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#4caf50] via-[#3e8e41] to-[#1b5e20] animate-gradient-xy">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2">Welcome Back!</h3>
          <p className="text-white/80 text-sm">Please enter your details</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <motion.div whileTap={{ scale: 0.995 }}>
            <input
              type="text"
              name="identifier"
              placeholder="Email / Username / Phone"
              value={loggedInUser.identifier}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all"
            />
          </motion.div>

          <div className="relative">
            <input
              type={viewPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loggedInUser.password}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-[#81c784] focus:outline-none transition-all pr-12"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
              onClick={() => setViewPassword(!viewPassword)}
            >
              {viewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#4caf50] hover:bg-[#45a049] text-white font-bold rounded-lg py-3 shadow-lg transition-all duration-300 cursor-pointer"
          >
            Login
          </motion.button>

          <div className="text-center pt-4 border-t border-white/10 mt-4">
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
        </form>
      </motion.div>
    </div>
  );
}
