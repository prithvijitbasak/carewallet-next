// Service preparing default date, categories, and recent expenses for Add Expense page

import { IUser } from "@/models/User";
import { expenseCategories } from "@/constants/expenseCategories";
import { expenseRepository } from "@/repositories/expense.repository";

export interface RecentExpenseItem {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: Date | string;
  notes?: string;
  createdAt?: Date | string;
}

export interface AddExpenseData {
  isLogin: boolean;
  user: {
    fullName: string;
    username: string;
  } | null;
  categories: string[];
  defaultDate: string;
  recentExpenses: RecentExpenseItem[];
}

export class AddExpenseService {
  // Prepares server-side props for the Add Expense page
  async getAddExpenseData(user: IUser): Promise<AddExpenseData> {
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
        // Fallback to server date
      }
    }

    // Format into HTML5 date input format: YYYY-MM-DD
    const yyyy = String(yearNum);
    const mm = String(monthNum + 1).padStart(2, "0");
    const dd = String(dateNum).padStart(2, "0");
    const defaultDate = `${yyyy}-${mm}-${dd}`;

    let recentExpenses: RecentExpenseItem[] = [];
    try {
      const rawExpenses = await expenseRepository.getRecentExpenses(user._id, 5);
      recentExpenses = rawExpenses.map((exp) => ({
        _id: String(exp._id),
        title: exp.title,
        amount: exp.amount,
        category: exp.category,
        date: exp.date,
        notes: exp.notes || "",
        createdAt: exp.createdAt,
      }));
    } catch (err) {
      console.error("Error fetching recent expenses for add-expense SSR:", err);
    }

    return {
      isLogin: true,
      user: {
        fullName: user.fullName,
        username: user.username,
      },
      categories: [...expenseCategories],
      defaultDate,
      recentExpenses,
    };
  }

  getEmptyAddExpenseData(): AddExpenseData {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return {
      isLogin: false,
      user: null,
      categories: [...expenseCategories],
      defaultDate: `${yyyy}-${mm}-${dd}`,
      recentExpenses: [],
    };
  }
}

export const addExpenseService = new AddExpenseService();
