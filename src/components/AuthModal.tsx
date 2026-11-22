"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUser, setIsLogin } from "@/redux/slices/authSlice";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  open,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const dispatch = useAppDispatch();

  const [method, setMethod] = useState<null | "email">(null);
  const [email, setEmail] = useState("");
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSendingOtp(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setIsExistingUser(Boolean(data.isExistingUser));
        toast.success("Verification code sent to your email");
      } else {
        setError(data.message || "Failed to send verification code");
        toast.error(data.message || "Failed to send verification code");
      }
    } catch {
      setError("Failed to send code. Please try again.");
      toast.error("Failed to send code. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp,
          fullName: isExistingUser ? undefined : fullName,
          username: isExistingUser ? undefined : username,
          timezone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setIsLogin(true));
        await dispatch(fetchUser());
        toast.success(
          isExistingUser ? "Welcome back!" : "Account created successfully!"
        );
        resetModal();
        if (onSuccess) {
          onSuccess();
        }
        window.location.href = `/${data.username}`;
      } else {
        setError(data.message || "Verification failed");
        toast.error(data.message || "Verification failed");
      }
    } catch {
      setError("Authentication failed. Please try again.");
      toast.error("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setMethod(null);
    setEmail("");
    setIsExistingUser(null);
    setOtpSent(false);
    setFullName("");
    setUsername("");
    setOtp("");
    setError(null);
    onClose();
  };

  return (
    <div
      onClick={resetModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden"
      >
        <button
          type="button"
          onClick={resetModal}
          className="absolute right-4 top-4 z-10 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <FaTimes size={18} />
        </button>

        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-7 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {method === null ? (
            <div>
              <div className="mb-6 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4caf50]">
                  Welcome to CareWallet
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose how you want to continue
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 transition duration-200 shadow-sm cursor-pointer"
                >
                  <FcGoogle size={22} />
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    OR
                  </span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <button
                  type="button"
                  onClick={() => setMethod("email")}
                  className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#4caf50] py-3 font-semibold text-white hover:bg-[#43a047] transition duration-200 shadow cursor-pointer"
                >
                  <FaEnvelope size={18} />
                  <span>Continue with Email</span>
                </button>
              </div>
            </div>
          ) : !otpSent ? (
            <div>
              <button
                type="button"
                onClick={() => {
                  setMethod(null);
                  setError(null);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 mb-4 cursor-pointer"
              >
                <FaArrowLeft size={12} />
                <span>Back to options</span>
              </button>

              <div className="mb-5 text-center">
                <h2 className="text-2xl font-bold text-[#4caf50]">
                  Continue with Email
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Enter your email to sign in or create an account
                </p>
              </div>

              {error && (
                <div className="mb-3 rounded-lg bg-red-50 p-2.5 text-center text-xs text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full rounded-lg bg-[#4caf50] py-2.5 font-semibold text-white hover:bg-[#43a047] transition duration-200 disabled:opacity-50 cursor-pointer shadow text-sm"
                >
                  {sendingOtp ? "Sending Code..." : "Continue"}
                </button>
              </form>
            </div>
          ) : isExistingUser ? (
            <div>
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-[#4caf50]">
                  Welcome Back!
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-gray-800">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-3 rounded-lg bg-red-50 p-2.5 text-center text-xs text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-center text-xl font-bold tracking-widest text-gray-900 focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] focus:outline-none"
                  />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError(null);
                    }}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="text-[#4caf50] font-semibold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {sendingOtp ? "Resending..." : "Resend Code"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#4caf50] py-2.5 font-semibold text-white hover:bg-[#43a047] transition duration-200 disabled:opacity-50 cursor-pointer shadow text-sm"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-[#4caf50]">
                  Create Your Account
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Code sent to{" "}
                  <span className="font-semibold text-gray-800">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-3 rounded-lg bg-red-50 p-2.5 text-center text-xs text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-center text-lg font-bold tracking-widest text-gray-900 focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] focus:outline-none"
                  />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError(null);
                    }}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="text-[#4caf50] font-semibold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {sendingOtp ? "Resending..." : "Resend Code"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#4caf50] py-2.5 font-semibold text-white hover:bg-[#43a047] transition duration-200 disabled:opacity-50 cursor-pointer shadow mt-2 text-sm"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
