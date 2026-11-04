import React from "react";

const DashBanner: React.FC = () => {
  return (
    <div className="bg-[#4caf50] mt-0.5 rounded shadow-sm">
      <div className="container">
        <div className="py-3">
          <h1 className="font-bold text-center text-white text-3xl tracking-wider pb-2">
            PB Expense Tracker
          </h1>
          <h2 className="font-medium text-center text-white text-xl tracking-wide pb-2">
            Track your day-to-day expenses
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashBanner;
