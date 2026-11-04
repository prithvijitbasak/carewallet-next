import React from "react";
import ExpenseSearchBox from "./ExpenseSearchBox";

const SearchBoxSection: React.FC = () => {
  return (
    <div className="py-8">
      <h4 className="text-xl font-bold text-center pb-6 text-gray-800">
        Search Your Previous Expenses
      </h4>
      <div className="flex flex-wrap justify-center gap-6 px-4">
        <ExpenseSearchBox searchType="date" />
        <ExpenseSearchBox searchType="month" />
      </div>
    </div>
  );
};

export default SearchBoxSection;
