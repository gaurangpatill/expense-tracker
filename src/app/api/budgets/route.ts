import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { createBudget, listBudgets } from "@/server/services/budgets";

export async function GET(request: Request) {
  try {
    const { userId } = await requireUser();
    const url = new URL(request.url);
    const month = url.searchParams.get("month") ?? undefined;
    const budgets = await listBudgets(userId, month);
    return NextResponse.json({ items: budgets });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const payload = await request.json();
    const budget = await createBudget(userId, payload);
    return NextResponse.json({ item: budget }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to create budget" }, { status: 400 });
  }
}
