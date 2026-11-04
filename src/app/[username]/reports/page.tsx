"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import DataTableShimmer from "@/components/shimmerUIs/DataTableShimmer";
import { alphaNumDate, formatDtConven } from "@/utils/formatterFunctions";
import dynamic from "next/dynamic";
import ReportDocument from "@/components/reports/ReportDocument";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <span className="bg-gray-400 text-white py-2 px-4 rounded text-sm">
        Preparing PDF...
      </span>
    ),
  }
);

export default function ReportsPage() {
  const [year] = useState(new Date().getFullYear());
  const currDate = new Date();

  const [startDate, setStartDate] = useState(
    formatDtConven(new Date(year, 0, 1))
  );
  const [endDate, setEndDate] = useState(formatDtConven(currDate));
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchReportData = async (s: string, e: string, p = 1) => {
    const response = await fetch(
      `/api/expenses/reports/date-range?startDateParam=${s}&endDateParam=${e}&page=${p}&limit=10`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["report-expenses", startDate, endDate, page],
    queryFn: () => fetchReportData(startDate, endDate, page),
    enabled: !!startDate && !!endDate,
  });

  const expenses = data?.expenses || [];

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
      header: () => <div className="text-center">Expense Added On</div>,
      cell: ({ row }) => {
        const createdAtValue = row.getValue("createdAt") as string;
        const formattedCreatedAt = new Date(createdAtValue).toLocaleString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        return (
          <div className="text-center text-xs text-gray-500">
            {formattedCreatedAt}
          </div>
        );
      },
    },
  ];

  const totalPages = data?.pagination?.totalPages || 1;
  const totalRecords = data?.pagination?.totalRecords || expenses.length;
  const totalAmount = data?.totalAmount || "0.00";

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {year} Expense Report
          </h2>
          <p className="font-medium text-gray-500 text-sm mt-1">
            {startDate} to {endDate} • Total Records:{" "}
            <span className="text-red-500 font-bold">{totalRecords}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium">Total Amount Spent</p>
          <h3 className="text-2xl font-extrabold text-red-600">₹{totalAmount}</h3>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        {isClient && expenses.length > 0 && (
          <PDFDownloadLink
            document={
              <ReportDocument
                expenses={expenses}
                startDate={startDate}
                endDate={endDate}
              />
            }
            fileName={`${year}_Expense_Report.pdf`}
            className="cursor-pointer bg-[#4caf50] hover:bg-[#43a047] text-white py-2.5 px-6 rounded-xl font-medium shadow-sm transition-colors text-sm"
          >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
          </PDFDownloadLink>
        )}
      </div>

      {isError && (
        <p className="p-4 text-red-500 bg-red-50 rounded-lg">
          Error loading expenses: {(error as any).message}
        </p>
      )}

      <div className="pt-2">
        {isLoading ? (
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
      </div>
    </div>
  );
}
