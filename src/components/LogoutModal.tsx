// Modal component to confirm user logout before ending session

"use client";

import React, { useState } from "react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If modal is not open, do not render anything
  if (!isOpen) {
    return null;
  }

  // Handle logout action when confirmed
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        await logout();
      }
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoggingOut}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logout Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-xs">
            <LogOut className="w-6 h-6" />
          </div>
        </div>

        {/* Confirmation Text */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Log out of CareWallet?
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isLoggingOut ? (
              <span>Logging out...</span>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
