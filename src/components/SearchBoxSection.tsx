import React from "react";
import ExpenseSearchBox from "./ExpenseSearchBox";
import { Search } from "lucide-react";

const SearchBoxSection: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 pb-2">
        <div className="w-10 h-10 rounded-2xl bg-[#4caf50]/10 text-[#4caf50] flex items-center justify-center">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Search Past Expenses
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Quickly query your expense ledger by an individual day or a specific month.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
        <ExpenseSearchBox searchType="date" />
        <ExpenseSearchBox searchType="month" />
      </div>
    </div>
  );
};

export default SearchBoxSection;
