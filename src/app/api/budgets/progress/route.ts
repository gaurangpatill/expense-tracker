import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { getBudgetProgress } from "@/server/services/budgets";

export async function GET(request: Request) {
  try {
    const { userId } = await requireUser();
    const url = new URL(request.url);
    const month = url.searchParams.get("month");
    if (!month) {
      return NextResponse.json({ error: "Month required" }, { status: 400 });
    }
    const progress = await getBudgetProgress(userId, month);
    return NextResponse.json({ items: progress });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
