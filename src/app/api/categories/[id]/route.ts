import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { deleteCategory, updateCategory } from "@/server/services/categories";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const payload = await request.json();
    const category = await updateCategory(userId, { ...payload, id });
    return NextResponse.json({ item: category });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update category" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const result = await deleteCategory(userId, id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
