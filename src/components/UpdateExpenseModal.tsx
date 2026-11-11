"use client";

import React, { useEffect, useState, useRef } from "react";
import "@/assets/styles/UpdateExpenseModal.css";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { formatDtConven, toInputDateFormat } from "@/utils/formatterFunctions";

interface UpdateExpenseModalProps {
  expenseData: {
    _id: string;
    title: string;
    amount: number;
    category: string;
    date: string | Date;
    notes?: string;
  };
  onClose: () => void;
  onUpdated: () => void;
}

const UpdateExpenseModal: React.FC<UpdateExpenseModalProps> = ({
  expenseData,
  onClose,
  onUpdated,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    amount: 0,
    category: "",
    date: "",
    notes: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expenseData) {
      const formattedISO = toInputDateFormat(expenseData.date);

      setFormData({
        _id: expenseData._id || "",
        title: expenseData.title || "",
        amount: expenseData.amount || 0,
        category: expenseData.category || "",
        date: formattedISO,
        notes: expenseData.notes || "",
      });
    }
  }, [expenseData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/expenses/categories");
        const data = await response.json();
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenCategoryDropdown(false);
      }
    };

    if (openCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCategoryDropdown]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isoDate = new Date(formData.date);
    const formattedDate = formatDtConven(isoDate);

    const payload = {
      ...formData,
      date: formattedDate,
    };

    try {
      const response = await fetch("/api/expenses/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Expense updated successfully.");
        onUpdated();
        onClose();
      } else {
        toast.error(result.message || "Failed to update expense.");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="update-modal-wrapper flex inset-0 items-center justify-center bg-[rgba(0,0,0,0.7)] w-full h-screen fixed top-0 pointer-events-none z-50">
      <div className="update-modal-container w-[90%] max-w-md pointer-events-auto">
        <div className="update-modal-contents bg-white rounded-xl shadow-2xl p-6">
          <div className="close-btn-div flex justify-end">
            <span
              className="close-btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-md cursor-pointer flex items-center justify-center transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <RxCross1 />
            </span>
          </div>
          <h2 className="modal-heading font-bold text-center text-2xl text-gray-800 mb-4">
            Edit Expense
          </h2>
          <form onSubmit={handleSubmit} className="modal-form space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4caf50] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4caf50] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4caf50] outline-none"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4caf50] outline-none h-20 resize-none"
              />
            </div>

            <div className="relative w-full" ref={dropdownRef}>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                placeholder="Select Category"
                readOnly
                onClick={() => setOpenCategoryDropdown((prev) => !prev)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4caf50] outline-none cursor-pointer bg-white"
              />
              {openCategoryDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {categories.map((category, idx) => (
                    <p
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                      onClick={() => {
                        handleChange("category", category);
                        setOpenCategoryDropdown(false);
                      }}
                    >
                      {category}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions text-center pt-2">
              <button
                type="submit"
                className="w-full bg-[#4caf50] hover:bg-[#43a047] text-white font-medium py-2.5 px-4 rounded-lg cursor-pointer transition-colors"
              >
                Update Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateExpenseModal;
