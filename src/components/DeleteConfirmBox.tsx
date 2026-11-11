"use client";

import React from "react";
import { toast } from "react-toastify";

interface DeleteConfirmBoxProps {
  expenseData: {
    _id: string;
    title: string;
  };
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteConfirmBox: React.FC<DeleteConfirmBoxProps> = ({
  expenseData,
  onClose,
  onDeleted,
}) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/expenses/${expenseData._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Expense deleted successfully!");
        onDeleted();
        onClose();
      } else {
        toast.error("Unable to delete the expense!");
      }
    } catch (error) {
      console.error("There is an error in deleting: ", error);
      toast.error("Unable to delete the expense!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 pointer-events-auto">
        <h3 className="font-bold text-xl text-center pb-2 text-gray-900">
          Heads Up! Are you sure you want to delete?
        </h3>
        <p className="text-center mb-6 text-gray-600">
          After deleting{" "}
          <span className="text-[#4caf50] font-bold">
            {expenseData.title}&apos;s
          </span>{" "}
          expense you will not be able to recover it!
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 font-medium cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            No
          </button>
          <button
            className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 font-medium cursor-pointer transition-colors"
            onClick={handleDelete}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmBox;
