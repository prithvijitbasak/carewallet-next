"use client";

import React, { useState, useEffect } from "react";

const ClockCard: React.FC = () => {
  const [time, setTime] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    const getDateSuffix = (day: number) => {
      if (day >= 11 && day <= 13) return "th";
      const lastDigit = day % 10;
      switch (lastDigit) {
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

    const updateTime = () => {
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      setWeekDay(days[now.getDay()]);

      const day = now.getDate();
      const suf = getDateSuffix(day);
      setSuffix(suf);

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

      setDate(`${day}`);
      setMonth(`${months[now.getMonth()]}`);
      setYear(`${now.getFullYear()}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock-card-wrapper w-full sm:w-72 bg-[#4caf50] p-4 rounded-xl shadow-md text-white">
      <p className="text-sm opacity-90">Today is,</p>
      <p className="text-xl font-bold mt-1">
        {weekDay} | {time}
      </p>
      <p className="text-right text-sm italic mt-2 opacity-90">
        {date}
        <sup className="ml-0.5">{suffix}</sup> {month}, {year}
      </p>
    </div>
  );
};

export default ClockCard;
