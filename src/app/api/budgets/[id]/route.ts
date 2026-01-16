import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { deleteBudget, updateBudget } from "@/server/services/budgets";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const payload = await request.json();
    const budget = await updateBudget(userId, { ...payload, id });
    return NextResponse.json({ item: budget });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update budget" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const result = await deleteBudget(userId, id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
