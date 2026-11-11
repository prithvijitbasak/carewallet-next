import { IUser } from "@/models/User";
import { expenseRepository } from "@/repositories/expense.repository";
import { formatDtConven } from "@/utils/formatterFunctions";

export interface DayDetailsData {
  isLogin: boolean;
  user: {
    fullName: string;
    username: string;
  } | null;
  date: string;
  formattedDate: string;
  previousDate: string;
  nextDate: string;
  totalExpenses: number;
  expenses: any[];
}

export interface DayDetailsQueryOptions {
  dateParam?: string;
}

export class DayDetailsService {
  async getDayDetailsData(
    user: IUser,
    options: DayDetailsQueryOptions = {}
  ): Promise<DayDetailsData> {
    const now = new Date();
    let yearNum = now.getFullYear();
    let monthNum = now.getMonth(); // 0 to 11
    let dateNum = now.getDate();

    if (user.timezone) {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: user.timezone,
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        const parts = formatter.formatToParts(now);
        const partMap: Record<string, number> = {};
        for (const p of parts) {
          if (p.type !== "literal") {
            partMap[p.type] = parseInt(p.value, 10);
          }
        }
        if (partMap.year && partMap.month && partMap.day) {
          yearNum = partMap.year;
          monthNum = partMap.month - 1;
          dateNum = partMap.day;
        }
      } catch {
        // Fallback
      }
    }

    const defaultDate = `${String(dateNum).padStart(2, "0")}-${String(
      monthNum + 1
    ).padStart(2, "0")}-${yearNum}`;
    const dateStr = options.dateParam || defaultDate;

    const dateParts = dateStr.split("-");
    const formattedDateForDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const startDate = new Date(formattedDateForDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(formattedDateForDate);
    endDate.setHours(23, 59, 59, 999);

    const currentDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    const prev = new Date(currentDate);
    const next = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 1);
    next.setDate(currentDate.getDate() + 1);

    const previousDate = formatDtConven(prev);
    const nextDate = formatDtConven(next);
    const formattedDate = currentDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const result = await expenseRepository.getExpensesByDate(
      user._id,
      startDate,
      endDate
    );

    return {
      isLogin: true,
      user: {
        fullName: user.fullName,
        username: user.username,
      },
      date: dateStr,
      formattedDate,
      previousDate,
      nextDate,
      totalExpenses: result.totalExpenses,
      expenses: result.expenses,
    };
  }

  getEmptyDayDetailsData(): DayDetailsData {
    const now = new Date();
    const defaultDate = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    return {
      isLogin: false,
      user: null,
      date: defaultDate,
      formattedDate: "",
      previousDate: "",
      nextDate: "",
      totalExpenses: 0,
      expenses: [],
    };
  }
}

export const dayDetailsService = new DayDetailsService();
