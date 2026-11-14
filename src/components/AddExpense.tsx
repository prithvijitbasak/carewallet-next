/**
 * ============================================================================
 * `AddExpense` COMPONENT (Dynamic Multi-Row Expense Entry Form)
 * ============================================================================
 * 
 * Beginner's Guide to this Component:
 * 
 * 1. Dynamic Form Rows:
 *    Users can add multiple expenses at once. We store an array of objects in state:
 *    `inputFields = [{ id, title, amount, category, date, note }]`
 *    - Clicking "Add More" appends a new blank item to the array.
 *    - Clicking the Trash icon removes that item by `id`.
 * 
 * 2. Controlled Inputs:
 *    Every input field reflects state (`value={field.title}`) and updates state
 *    via `handleChange(id, "title", e.target.value)`.
 * 
 * 3. Validation & Batch Submission:
 *    Before submitting to the server, we check that required fields (Title, Amount,
 *    Category, Date) are non-empty, and send all rows in a single batch POST request.
 */

"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaChevronDown } from "react-icons/fa";

interface InputFieldItem {
  id: number;
  title: string;
  amount: string;
  category: string;
  date: string;
  note: string;
}

interface AddExpenseProps {
  initialCategories?: string[];
  defaultDate?: string;
}

const AddExpense: React.FC<AddExpenseProps> = ({
  initialCategories = [],
  defaultDate = "",
}) => {
  // Initialize with one empty expense row
  const [inputFields, setInputFields] = useState<InputFieldItem[]>([
    {
      id: 1,
      title: "",
      amount: "",
      category: "",
      date: defaultDate || "",
      note: "",
    },
  ]);

  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState<number | null>(
    null
  );

  // If categories weren't passed via SSR props, fetch them from the API
  useEffect(() => {
    if (initialCategories.length > 0) return;

    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/expenses/categories");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  /**
   * Updates an individual field on an expense row by its unique ID
   */
  const handleChange = (id: number, field: keyof InputFieldItem, value: string) => {
    setInputFields((prevFields) =>
      prevFields.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  /**
   * Appends a new blank expense row
   */
  const addInputFields = () => {
    setInputFields((prev) => [
      ...prev,
      {
        id: Date.now(), // Generate a unique timestamp ID
        title: "",
        amount: "",
        category: "",
        date: defaultDate || "",
        note: "",
      },
    ]);
  };

  /**
   * Removes an expense row by its unique ID (maintaining at least 1 row)
   */
  const deleteInputFields = (id: number) => {
    if (inputFields.length > 1) {
      setInputFields((prev) => prev.filter((field) => field.id !== id));
    } else {
      toast.info("At least one expense row is required");
    }
  };

  /**
   * Validates all rows and sends batch POST request to /api/expenses
   */
  const handleSubmit = async () => {
    // Client-side validation: verify all required fields
    for (const field of inputFields) {
      if (!field.title.trim() || !field.amount.trim() || !field.category.trim() || !field.date) {
        toast.error("Please fill in all required fields (Title, Amount, Category, Date)!");
        return;
      }
      if (isNaN(parseFloat(field.amount)) || parseFloat(field.amount) < 0) {
        toast.error("Please enter a valid positive amount!");
        return;
      }
    }

    // Format dates to DD-MM-YYYY expected by CareWallet API
    const expenses = inputFields.map((field) => {
      const [year, month, day] = field.date.split("-");
      const formattedDate = `${day}-${month}-${year}`;

      return {
        title: field.title.trim(),
        amount: parseFloat(field.amount),
        category: field.category.trim(),
        date: formattedDate,
        notes: field.note.trim(),
      };
    });

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(expenses),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Expenses added successfully!");
        // Reset form to a single fresh row
        setInputFields([
          {
            id: 1,
            title: "",
            amount: "",
            category: "",
            date: defaultDate || "",
            note: "",
          },
        ]);
      } else {
        toast.error(data.message || "Failed to add expenses");
      }
    } catch (error) {
      console.error("Error submitting expenses:", error);
      toast.error("Something went wrong while saving expenses!");
    }
  };

  const handleCategoryClick = (id: number) => {
    setOpenCategoryDropdown((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-2 md:px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Header section with Add More button */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Expenses</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Record one or multiple expenses at once
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#4caf50] hover:bg-[#43a047] text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer transition-all shadow-sm text-sm"
            onClick={addInputFields}
          >
            <FaPlus className="text-xs" />
            <span>Add More</span>
          </button>
        </div>

        {/* Dynamic list of expense entry rows */}
        <div className="space-y-4">
          {inputFields.map((field) => (
            <div
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-gray-50/80 p-4 rounded-xl border border-gray-200"
              key={field.id}
            >
              {/* Title input */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1 md:hidden">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Title (e.g. Grocery, Lunch)"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#4caf50] focus:border-[#4caf50] outline-none transition-colors"
                  value={field.title}
                  onChange={(e) =>
                    handleChange(field.id, "title", e.target.value)
                  }
                />
              </div>

              {/* Amount input */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1 md:hidden">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Amount"
                    required
                    min="0"
                    step="any"
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#4caf50] focus:border-[#4caf50] outline-none transition-colors"
                    value={field.amount}
                    onChange={(e) =>
                      handleChange(field.id, "amount", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Category selector dropdown */}
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-semibold text-gray-600 mb-1 md:hidden">
                  Category
                </label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleCategoryClick(field.id)}
                >
                  <input
                    type="text"
                    placeholder="Category"
                    required
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#4caf50] focus:border-[#4caf50] outline-none cursor-pointer pr-8"
                    value={field.category}
                  />
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>

                {openCategoryDropdown === field.id && (
                  <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto py-1">
                    {categories.length > 0 ? (
                      categories.map((value, cIdx) => (
                        <div
                          key={cIdx}
                          className="px-4 py-2 hover:bg-[#4caf50]/10 hover:text-[#4caf50] cursor-pointer text-sm text-gray-800 transition-colors"
                          onClick={() => {
                            handleChange(field.id, "category", value);
                            setOpenCategoryDropdown(null);
                          }}
                        >
                          {value}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-gray-500">
                        Loading categories...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Date picker */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1 md:hidden">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#4caf50] focus:border-[#4caf50] outline-none transition-colors"
                  value={field.date}
                  onChange={(e) =>
                    handleChange(field.id, "date", e.target.value)
                  }
                />
              </div>

              {/* Notes input */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1 md:hidden">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#4caf50] focus:border-[#4caf50] outline-none transition-colors"
                  value={field.note}
                  onChange={(e) =>
                    handleChange(field.id, "note", e.target.value)
                  }
                />
              </div>

              {/* Remove row button */}
              <div className="md:col-span-1 flex justify-center pt-2 md:pt-0">
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-600 cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors"
                  onClick={() => deleteInputFields(field.id)}
                  title="Remove this row"
                >
                  <FaTrash className="text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold py-3.5 px-12 rounded-xl cursor-pointer transition-all shadow-md hover:shadow-lg text-base tracking-wide"
            onClick={handleSubmit}
          >
            Submit Expenses
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
