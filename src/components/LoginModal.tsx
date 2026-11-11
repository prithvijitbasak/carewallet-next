"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUser, setIsLogin } from "@/redux/slices/authSlice";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(setIsLogin(true));
        await dispatch(fetchUser());
        toast.success("Logged in successfully");
        onClose();
        if (onSuccess) onSuccess();
        router.push(`/${data.username}`);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes />
        </button>
        <h2 className="mb-4 text-2xl font-bold text-[#4caf50]">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={credentials.identifier}
              onChange={(e) =>
                setCredentials({ ...credentials, identifier: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-[#4caf50] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-[#4caf50] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#4caf50] py-2 font-medium text-white hover:bg-[#43a047] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
