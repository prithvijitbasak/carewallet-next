import { IUser } from "@/models/User";
import { expenseRepository } from "@/repositories/expense.repository";

export interface ReportPagination {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface ReportsData {
  isLogin: boolean;
  user: {
    fullName: string;
    username: string;
  } | null;
  year: number;
  startDate: string;
  endDate: string;
  totalAmount: string;
  pagination: ReportPagination;
  expenses: any[];
}

export interface ReportsQueryOptions {
  startDateParam?: string;
  endDateParam?: string;
  pageParam?: string;
  limitParam?: string;
}

export class ReportsService {
  async getReportsData(
    user: IUser,
    options: ReportsQueryOptions = {}
  ): Promise<ReportsData> {
    const now = new Date();
    let yearNum = now.getFullYear();
    let monthNum = now.getMonth();
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

    const defaultStartDate = `01-01-${yearNum}`;
    const defaultEndDate = `${String(dateNum).padStart(2, "0")}-${String(
      monthNum + 1
    ).padStart(2, "0")}-${yearNum}`;

    const startDateStr = options.startDateParam || defaultStartDate;
    const endDateStr = options.endDateParam || defaultEndDate;
    const pageNum = parseInt(options.pageParam || "1", 10) || 1;
    const limitNum = parseInt(options.limitParam || "10", 10) || 10;

    const startDateParts = startDateStr.split("-");
    const endDateParts = endDateStr.split("-");

    const formattedStartDate = `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`;
    const formattedEndDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;

    const startDate = new Date(formattedStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedEndDate);
    endDate.setHours(23, 59, 59, 999);

    const report = await expenseRepository.getDateRangeReport(
      user._id,
      startDate,
      endDate,
      pageNum,
      limitNum
    );

    return {
      isLogin: true,
      user: {
        fullName: user.fullName,
        username: user.username,
      },
      year: yearNum,
      startDate: startDateStr,
      endDate: endDateStr,
      totalAmount: report.totalAmount,
      pagination: report.pagination,
      expenses: report.expenses,
    };
  }

  getEmptyReportsData(): ReportsData {
    const now = new Date();
    const year = now.getFullYear();
    const startDate = `01-01-${year}`;
    const endDate = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${year}`;

    return {
      isLogin: false,
      user: null,
      year,
      startDate,
      endDate,
      totalAmount: "0.00",
      pagination: {
        totalRecords: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 10,
      },
      expenses: [],
    };
  }
}

export const reportsService = new ReportsService();
