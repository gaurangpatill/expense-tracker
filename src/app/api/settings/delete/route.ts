import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { softDeleteUser } from "@/server/services/users";

export async function POST() {
  try {
    const { userId } = await requireUser();
    await softDeleteUser(userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
