"use client";

import React, { useRef, useState, useEffect } from "react";
import "@/assets/styles/Profile.css";
import ProfilePageShimmer from "@/components/shimmerUIs/ProfilePageShimmer";
import { toast } from "react-toastify";
import Loader from "@/icons/Loader";
import DeleteImageConfirmModal from "@/components/DeleteImageConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import { ProfileData } from "@/services/profile.service";

interface ProfileContentProps {
  initialData?: ProfileData | null;
  routeUsername?: string;
}

export default function ProfileContent({
  initialData,
  routeUsername,
}: ProfileContentProps) {
  const { user: authUser, loading: authLoading, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
  });

  const user = authUser || initialData?.user || null;
  const loading = !initialData?.user && authLoading;

  useEffect(() => {
    if (!authUser && initialData?.user) {
      setUser(initialData.user as any);
    }
  }, [authUser, initialData?.user, setUser]);

  const handleImageEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await fetch("/api/users/upload-image", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  image: data.image,
                }
              : null
          );
        } else {
          toast.error(data.message || "Image upload failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image");
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setOpenDeleteConfirmBox(true);
  };

  const handleImageDeleteSuccess = () => {
    setOpenDeleteConfirmBox(false);
    setUser((prev) =>
      prev
        ? {
            ...prev,
            image: null,
          }
        : null
    );
  };

  const handleOpenEdit = () => {
    if (!user) return;
    setEditForm({
      fullName: user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setIsEditing(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setUser((prev) => (prev ? { ...prev, ...editForm } : null));
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return <ProfilePageShimmer />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 bg-gray-50">
        No user data found. Please log in again.
      </div>
    );
  }

  const hasImage = user.image && user.image.data;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 flex items-center justify-center p-4 md:p-6">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-6 md:p-8 max-w-lg w-full border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#4caf50] rounded-t-2xl"></div>

          <div className="flex flex-col items-center justify-center mb-8 mt-2 relative">
            <div className="relative group w-fit">
              {hasImage ? (
                <div className="h-44 w-44 flex items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-lg bg-gray-50">
                  {imageUploading ? (
                    <Loader className="w-12 h-12" color="#4caf50" />
                  ) : (
                    <img
                      src={`data:${user.image?.contentType};base64,${user.image?.data}`}
                      alt="User Profile"
                      className="block h-full w-full object-cover"
                    />
                  )}
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-[#4caf50]/10 flex items-center justify-center text-[#4caf50] text-5xl font-bold shadow-inner border-4 border-white">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
              )}

              {hasImage && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute bottom-2 left-2 bg-red-500 p-2.5 rounded-full text-white shadow-md hover:bg-red-600 hover:scale-110 transition-all cursor-pointer border-2 border-white"
                  title="Remove Profile Picture"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}

              <button
                onClick={handleImageEditClick}
                className="absolute bottom-2 right-2 bg-[#4caf50] p-2.5 rounded-full text-white shadow-md hover:bg-[#43a047] hover:scale-110 transition-all cursor-pointer border-2 border-white"
                title={
                  hasImage ? "Change Profile Picture" : "Upload Profile Picture"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4 text-center">
              {user.fullName}
            </h1>
            <p className="text-gray-500 text-sm mt-1 bg-gray-100 px-3 py-1 rounded-full">
              @{user.username}
            </p>
          </div>

          {!isEditing ? (
            <>
              <div className="space-y-3">
                {[
                  { label: "Email", value: user.email },
                  { label: "Phone", value: user.phone },
                  { label: "Timezone", value: user.timezone },
                  { label: "Role", value: user.role },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-[#4caf50]/5 transition"
                  >
                    <span className="font-medium text-gray-600 text-sm">
                      {item.label}:
                    </span>
                    <span className="text-gray-800 truncate max-w-[60%] text-right font-medium text-sm">
                      {item.value || "—"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={handleOpenEdit}
                  className="w-full py-3 bg-[#4caf50] text-white font-medium rounded-lg hover:bg-[#43a047] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Edit Account Details
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateUser} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4caf50]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4caf50]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4caf50]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4caf50]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4caf50] hover:bg-[#43a047] text-white rounded-lg font-medium cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {openDeleteConfirmBox && (
        <DeleteImageConfirmModal
          onClose={() => setOpenDeleteConfirmBox(false)}
          onDeleted={handleImageDeleteSuccess}
        />
      )}
    </>
  );
}
