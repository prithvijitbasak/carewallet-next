import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense from "@/models/Expense";

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status });
    }

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDateParam");
    const endDateParam = searchParams.get("endDateParam");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { error: "Missing date parameters" },
        { status: 400 }
      );
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const startDateParts = startDateParam.split("-");
    const endDateParts = endDateParam.split("-");

    const formattedStartDate = `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`;
    const formattedEndDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;

    const startDate = new Date(formattedStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedEndDate);
    endDate.setHours(23, 59, 59, 999);

    const matchQuery = {
      user: new mongoose.Types.ObjectId(user._id),
      date: { $gte: startDate, $lte: endDate },
    };

    const totalStats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    const totalAmount = totalStats.length > 0 ? totalStats[0].totalAmount : 0;
    const totalRecords = totalStats.length > 0 ? totalStats[0].totalCount : 0;

    const expenses = await Expense.find(matchQuery)
      .select("_id title amount category date notes createdAt updatedAt")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    return NextResponse.json({
      totalAmount: totalAmount.toFixed(2),
      pagination: {
        totalRecords,
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecords / limitNum),
        limit: limitNum,
      },
      expenses,
    });
  } catch (err) {
    console.error("Error fetching report expenses:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
