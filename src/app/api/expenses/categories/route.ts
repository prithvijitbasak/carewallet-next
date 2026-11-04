import { NextResponse } from "next/server";
import { expenseCategories } from "@/constants/expenseCategories";

export async function GET() {
  return NextResponse.json({ categories: expenseCategories }, { status: 200 });
}
