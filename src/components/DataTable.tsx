"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pageIndex: number;
  onPageChange: (page: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: {
        pageIndex: Math.max(0, pageIndex - 1),
        pageSize: 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const nextState = updater({
          pageIndex: Math.max(0, pageIndex - 1),
          pageSize: 10,
        });
        onPageChange(nextState.pageIndex + 1);
      }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border bg-white text-gray-900 shadow-sm overflow-hidden">
        <div className="relative w-full overflow-x-auto">
          <Table className="min-w-[600px] w-full text-sm">
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-b"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 font-semibold text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 italic"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">
            Page {pageIndex} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageIndex - 1)}
              disabled={pageIndex <= 1}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageIndex + 1)}
              disabled={pageIndex >= pageCount}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
