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
import { alphaNumDate } from "@/utils/formatterFunctions";
import monthData from "@/data/monthData.json";
import { MonthDetailsData } from "@/services/month-details.service";

interface MonthDetailsContentProps {
  initialData?: MonthDetailsData | null;
  initialMonth?: string;
  initialYear?: string;
  routeUsername?: string;
}

export default function MonthDetailsContent({
  initialData,
  initialMonth,
  initialYear,
  routeUsername,
}: MonthDetailsContentProps) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const now = new Date();
  const defaultMonth = String(now.getMonth() + 1).padStart(2, "0");
  const defaultYear = String(now.getFullYear());

  const month =
    searchParams.get("month") ||
    initialMonth ||
    initialData?.month ||
    defaultMonth;
  const year =
    searchParams.get("year") ||
    initialYear ||
    initialData?.year ||
    defaultYear;

  const [page, setPage] = useState(1);
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

  const fetchExpenses = async (m: string, y: string, currentPage = 1) => {
    const url = `/api/expenses/get-expenses-by-month?month=${m}&year=${y}&page=${currentPage}&limit=10`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    return await response.json();
  };

  const isInitialMatch =
    Boolean(initialData) &&
    page === 1 &&
    month === initialData?.month &&
    year === initialData?.year;

  const { data, isLoading, error } = useQuery({
    queryKey: ["month-expenses", month, year, page],
    queryFn: () => fetchExpenses(month, year, page),
    enabled: !!month && !!year,
    initialData: isInitialMatch
      ? {
          totalExpenses: initialData?.totalExpenses ?? 0,
          totalRecords: initialData?.totalRecords ?? 0,
          totalPages: initialData?.totalPages ?? 1,
          currentPage: initialData?.currentPage ?? 1,
          expenses: initialData?.expenses ?? [],
        }
      : undefined,
  });

  const expenses = data?.expenses || [];
  const totalExpense = useTotalExpense("month", {
    month: `${month}`,
    year: `${year}`,
  });

  const totalPages = data?.totalPages || 1;
  const totalRecords = data?.totalRecords || expenses.length;

  if (error) {
    return (
      <p className="p-4 text-red-500">
        Error loading expenses: {(error as any).message}
      </p>
    );
  }

  const currentMonthDate = new Date(Number(year), Number(month) - 1, 1);
  const prevMonthDate = new Date(currentMonthDate);
  prevMonthDate.setMonth(currentMonthDate.getMonth() - 1);
  const nextMonthDate = new Date(currentMonthDate);
  nextMonthDate.setMonth(currentMonthDate.getMonth() + 1);

  const previousMonth = String(prevMonthDate.getMonth() + 1).padStart(2, "0");
  const previousYear = prevMonthDate.getFullYear();
  const nextMonth = String(nextMonthDate.getMonth() + 1).padStart(2, "0");
  const nextYear = nextMonthDate.getFullYear();
  const formattedMonthLabel =
    (monthData as Record<string, string>)[month] || month;

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
          Total for {formattedMonthLabel} {year}:{" "}
          <span className="font-bold text-red-600">
            ₹{displayTotal}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Showing page {page} of {totalPages} • Total: {totalRecords} records
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${activeUsername}/month-details?month=${previousMonth}&year=${previousYear}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full transition-all shadow-sm border border-gray-200 text-sm font-medium"
            onClick={() => setPage(1)}
          >
            <MdSkipPrevious className="text-lg" />
            <span>Prev Month</span>
          </Link>

          <Link
            href={`/${activeUsername}/month-details?month=${nextMonth}&year=${nextYear}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full transition-all shadow-sm border border-gray-200 text-sm font-medium"
            onClick={() => setPage(1)}
          >
            <span>Next Month</span>
            <MdSkipNext className="text-lg" />
          </Link>
        </div>
      </div>

      {isLoading && !expenses.length ? (
        <DataTableShimmer />
      ) : (
        <DataTable
          columns={columns}
          data={expenses}
          pageCount={totalPages}
          pageIndex={page}
          onPageChange={(newPage) => setPage(newPage)}
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
            queryClient.invalidateQueries({
              queryKey: ["month-expenses", month, year, page],
            });
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
            queryClient.invalidateQueries({
              queryKey: ["month-expenses", month, year, page],
            });
          }}
        />
      )}
    </div>
  );
}
