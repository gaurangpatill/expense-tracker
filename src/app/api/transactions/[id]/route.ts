import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { deleteTransaction, getTransaction, updateTransaction } from "@/server/services/transactions";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const transaction = await getTransaction(userId, id);
    if (!transaction) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item: transaction });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const payload = await request.json();
    const transaction = await updateTransaction(userId, { ...payload, id });
    return NextResponse.json({ item: transaction });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update transaction" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const result = await deleteTransaction(userId, id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
