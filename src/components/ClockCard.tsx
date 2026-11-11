"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const ClockCard: React.FC = () => {
  const [time, setTime] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      setDateStr(`${day}${suf} ${months[now.getMonth()]}, ${now.getFullYear()}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="h-12 w-64 bg-white/60 rounded-2xl border border-gray-100 animate-pulse" />
    );
  }

  return (
    <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-100 shadow-sm text-gray-800">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#4caf50]/10 text-[#4caf50]">
        <Clock className="w-4 h-4" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf50] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4caf50]"></span>
        </span>
      </div>
      <div className="text-left leading-tight">
        <p className="text-xs font-semibold text-gray-500">
          {weekDay}, {dateStr}
        </p>
        <p className="text-sm font-bold font-mono tracking-wider text-gray-800">
          {time}
        </p>
      </div>
    </div>
  );
};

export default ClockCard;
