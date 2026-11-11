"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

interface DeleteImageConfirmModalProps {
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteImageConfirmModal: React.FC<DeleteImageConfirmModalProps> = ({
  onClose,
  onDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/users/remove-image", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Image deleted successfully!");
        onDeleted();
        onClose();
      } else {
        toast.error(data.message || "Failed to delete image.");
      }
    } catch (error) {
      console.error("There is an error in removing: ", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
        </div>

        <h3 className="font-bold text-xl text-gray-900 text-center mb-2">
          Delete this image?
        </h3>
        <p className="text-gray-500 text-center text-sm mb-6">
          This action cannot be undone. The image will be permanently removed.
        </p>

        <div className="flex justify-center gap-3">
          <button
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
            onClick={handleRemove}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteImageConfirmModal;
