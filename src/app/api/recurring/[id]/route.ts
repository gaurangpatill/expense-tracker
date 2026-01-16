import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { deleteRecurringRule, updateRecurringRule } from "@/server/services/recurring";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const payload = await request.json();
    const item = await updateRecurringRule(userId, { ...payload, id });
    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update recurring rule" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const result = await deleteRecurringRule(userId, id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
