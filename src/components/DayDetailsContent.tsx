"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { DataTable } from "@/components/DataTable";
import DataTableShimmer from "@/components/shimmerUIs/DataTableShimmer";
import UpdateExpenseModal from "@/components/UpdateExpenseModal";
import DeleteConfirmBox from "@/components/DeleteConfirmBox";
import useTotalExpense from "@/hooks/useTotalExpense";
import { useAuth } from "@/hooks/useAuth";
import { formatDtConven, alphaNumDate } from "@/utils/formatterFunctions";
import { DayDetailsData } from "@/services/day-details.service";

interface DayDetailsContentProps {
  initialData?: DayDetailsData | null;
  initialDate?: string;
  routeUsername?: string;
}

export default function DayDetailsContent({
  initialData,
  initialDate,
  routeUsername,
}: DayDetailsContentProps) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") || initialDate;

  const today = new Date();
  const defaultDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  const date = dateParam || initialData?.date || defaultDate;

  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [openDelConfirm, setOpenDelConfirm] = useState(false);
  const { user } = useAuth();
  const activeUsername = user?.username || routeUsername || initialData?.user?.username || "";

  const handleEditClicked = (expense: any) => {
    setSelectedExpense(expense);
    setOpenModal(true);
  };

  const handleDelClicked = (expense: any) => {
    setSelectedExpense(expense);
    setOpenDelConfirm(true);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "S.No",
      header: () => <div className="text-center">S.No</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "title",
      header: () => <div className="text-center">Title</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-center">Amount (₹)</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return (
          <div className="font-semibold text-red-600 text-center">
            ₹{amount.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => <div className="text-center">Category</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">Date</div>,
      cell: ({ row }) => {
        const dateValue = row.getValue("date") as string;
        const formatted = alphaNumDate(dateValue);
        return <div className="text-center">{formatted}</div>;
      },
    },
    {
      accessorKey: "notes",
      header: () => <div className="text-center">Notes</div>,
      cell: ({ row }) => {
        const notes = (row.getValue("notes") as string) || "";
        return (
          <div className="text-center text-gray-600 text-xs">
            {notes.length > 40 ? notes.substring(0, 40) + "..." : notes || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Added On</div>,
      cell: ({ row }) => {
        const createdAtValue = row.getValue("createdAt") as string;
        const formatted = new Date(createdAtValue).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return <div className="text-center text-xs text-gray-500">{formatted}</div>;
      },
    },
    {
      id: "edit",
      header: () => <div className="text-center">Edit</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <button
            className="text-blue-500 hover:text-blue-700 cursor-pointer text-lg p-1"
            onClick={() => handleEditClicked(row.original)}
            title="Edit"
          >
            <FaEdit className="inline" />
          </button>
        </div>
      ),
    },
    {
      id: "delete",
      header: () => <div className="text-center">Delete</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer text-lg p-1"
            onClick={() => handleDelClicked(row.original)}
            title="Delete"
          >
            <MdDelete className="inline" />
          </button>
        </div>
      ),
    },
  ];

  const fetchExpenses = async (d: string) => {
    const response = await fetch(
      `/api/expenses/get-expenses-by-date?date=${d}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const data = await response.json();
    return data.expenses || [];
  };

  const isInitialMatch = Boolean(initialData) && date === initialData?.date;

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["day-expenses", date],
    queryFn: () => fetchExpenses(date),
    enabled: !!date,
    initialData: isInitialMatch ? initialData?.expenses : undefined,
  });

  const totalExpense = useTotalExpense("day", { date });

  if (error) {
    return (
      <p className="p-4 text-red-500">
        Error loading expenses: {(error as any).message}
      </p>
    );
  }

  const [dPart, mPart, yPart] = date.split("-");
  const currentDate = new Date(Number(yPart), Number(mPart) - 1, Number(dPart));

  const prev = new Date(currentDate);
  const next = new Date(currentDate);
  prev.setDate(currentDate.getDate() - 1);
  next.setDate(currentDate.getDate() + 1);

  const previousDate = formatDtConven(prev);
  const nextDate = formatDtConven(next);
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const displayTotal =
    isInitialMatch && initialData?.totalExpenses !== undefined && totalExpense.loading
      ? initialData.totalExpenses.toFixed(2)
      : totalExpense.loading
      ? "Loading..."
      : totalExpense.total.toFixed(2);

  return (
    <div className="mt-4 px-2 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Expense History</h3>
        <div className="text-base text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          Total for {formattedDate}:{" "}
          <span className="font-bold text-red-600">
            ₹{displayTotal}
          </span>
        </div>
      </div>

      <div className="flex justify-end items-center mb-6 gap-3">
        <Link
          href={`/${activeUsername}/day-details?date=${previousDate}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full transition-all shadow-sm border border-gray-200 text-sm font-medium"
        >
          <MdSkipPrevious className="text-lg" />
          <span>Prev Day</span>
        </Link>

        <Link
          href={`/${activeUsername}/day-details?date=${nextDate}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full transition-all shadow-sm border border-gray-200 text-sm font-medium"
        >
          <span>Next Day</span>
          <MdSkipNext className="text-lg" />
        </Link>
      </div>

      {isLoading && !expenses.length ? (
        <DataTableShimmer />
      ) : (
        <DataTable
          columns={columns}
          data={expenses}
          pageCount={1}
          pageIndex={1}
          onPageChange={() => {}}
        />
      )}

      {openModal && selectedExpense && (
        <UpdateExpenseModal
          expenseData={selectedExpense}
          onClose={() => {
            setOpenModal(false);
            setSelectedExpense(null);
          }}
          onUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ["day-expenses", date] });
          }}
        />
      )}

      {openDelConfirm && selectedExpense && (
        <DeleteConfirmBox
          expenseData={selectedExpense}
          onClose={() => {
            setOpenDelConfirm(false);
            setSelectedExpense(null);
          }}
          onDeleted={() => {
            queryClient.invalidateQueries({ queryKey: ["day-expenses", date] });
          }}
        />
      )}
    </div>
  );
}
