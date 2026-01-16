import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { deleteAccount } from "@/server/services/accounts";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUser();
    const { id } = await context.params;
    const result = await deleteAccount(userId, id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
