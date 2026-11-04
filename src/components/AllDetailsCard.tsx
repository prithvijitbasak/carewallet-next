"use client";

import React, { useEffect, useState } from "react";
import "@/assets/styles/AllDetailsCard.css";
import { formatDateTime, formatDtConven } from "@/utils/formatterFunctions";

interface AllDetailsCardProps {
  index?: number;
  expense: {
    _id: string;
    title: string;
    amount: number;
    category: string;
    date: string | Date;
    notes?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  checkIsEditClicked: (expense: any) => void;
  checkIsDelClicked: (expense: any) => void;
}

const AllDetailsCard: React.FC<AllDetailsCardProps> = ({
  index,
  expense,
  checkIsEditClicked,
  checkIsDelClicked,
}) => {
  const { title, amount, category, date, notes, createdAt, updatedAt } =
    expense;

  const [editTime, showEditTime] = useState(false);

  useEffect(() => {
    if (new Date(createdAt).getTime() !== new Date(updatedAt).getTime()) {
      showEditTime(true);
    } else {
      showEditTime(false);
    }
  }, [createdAt, updatedAt]);

  return (
    <div
      className="expense-card flex flex-col justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      key={index}
    >
      <div className="pb-3 space-y-1.5 text-sm text-gray-700">
        <p className="title text-base font-semibold text-gray-900">
          <span className="font-bold text-gray-900">Title:</span> {title}
        </p>
        <p className="price text-lg font-bold text-[#4caf50]">
          <span className="font-bold text-gray-900">Price:</span> ₹{amount}
        </p>
        <p className="category">
          <span className="font-bold text-gray-900">Category:</span> {category}
        </p>
        <p className="date">
          <span className="font-bold text-gray-900">Date of expense:</span>{" "}
          {formatDtConven(date)}
        </p>
        {notes && (
          <p className="notes text-gray-600">
            <span className="font-bold text-gray-900">Notes:</span> {notes}
          </p>
        )}
        <p className="created-date text-xs text-gray-500">
          <span className="font-bold text-gray-700">Added on:</span>{" "}
          {formatDateTime(createdAt)}
        </p>
      </div>
      <div
        className={`edit-delete-btn flex ${
          editTime ? "justify-between" : "justify-end"
        } gap-4 items-end pt-3 border-t border-gray-100`}
      >
        {editTime && (
          <p className="text-xs text-gray-400 italic">
            Last edited: {formatDateTime(updatedAt)}
          </p>
        )}
        <div className="flex justify-between gap-3">
          <button
            className="rounded bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors"
            onClick={() => checkIsEditClicked(expense)}
          >
            Edit
          </button>
          <button
            className="rounded bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors"
            onClick={() => checkIsDelClicked(expense)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllDetailsCard;
