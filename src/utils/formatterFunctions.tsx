import React from "react";

export const formatDateTime = (isoString: string | Date): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
};

export const formatDtConven = (isoString: string | Date): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${day}-${month}-${year}`;
};

export const toInputDateFormat = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export interface BritishDateProps {
  date: string;
}

export const BritishDate: React.FC<BritishDateProps> = ({ date }) => {
  if (!date) return null;
  const parts = date.split("-");
  if (parts.length !== 3) return <span>{date}</span>;
  const [day, month, year] = parts;
  const dayNum = parseInt(day, 10);

  const getDaySuffix = (d: number): string => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[parseInt(month, 10) - 1] || "";

  return (
    <span>
      {dayNum}
      <sup>{getDaySuffix(dayNum)}</sup> {monthName}, {year}
    </span>
  );
};

export const alphaNumDate = (dateString: string | Date): string => {
  const date = new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return date;
};

export const formatInputDate = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};
