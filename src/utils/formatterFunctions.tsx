// Date and currency formatting helper functions and components

import React from "react";

// Formats a Date or ISO string into DD-MM-YYYY | HH:mm:ss string
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

// Formats a Date or ISO string into simple DD-MM-YYYY format
export const formatDtConven = (isoString: string | Date): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${day}-${month}-${year}`;
};

// Formats a date into alphanumeric short date string (e.g. 13 Nov 2026)
export const alphaNumDate = (dateString: string | Date): string => {
  const date = new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return date;
};

// Converts an HTML date input value (YYYY-MM-DD) to standard DD-MM-YYYY string
export const formatInputDate = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

// Converts a Date into YYYY-MM-DD format required by HTML date inputs
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

// Component rendering a DD-MM-YYYY string into British English notation with superscript suffix
export const BritishDate: React.FC<BritishDateProps> = ({ date }) => {
  if (!date) return null;
  const parts = date.split("-");
  if (parts.length !== 3) return <span>{date}</span>;
  const [day, month, year] = parts;
  const dayNum = parseInt(day, 10);

  // Computes English ordinal suffix: 1st, 2nd, 3rd, 4th, ..., 11th, 12th, 13th, 21st, etc.
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = monthNames[monthIndex] || month;

  return (
    <span>
      {dayNum}
      <sup>{getDaySuffix(dayNum)}</sup> {monthName}, {year}
    </span>
  );
};
