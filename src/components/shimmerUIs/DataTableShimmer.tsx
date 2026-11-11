import React from "react";

interface DataTableShimmerProps {
  rowCount?: number;
  columnCount?: number;
}

const DataTableShimmer: React.FC<DataTableShimmerProps> = ({
  rowCount = 5,
  columnCount = 4,
}) => {
  return (
    <div className="w-full rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="relative w-full overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              {Array.from({ length: columnCount }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b last:border-0">
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-4 align-middle">
                    <div
                      className={`h-4 bg-gray-200 animate-pulse rounded ${
                        colIndex === 0
                          ? "w-12"
                          : colIndex === 1
                          ? "w-full"
                          : "w-20"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableShimmer;
