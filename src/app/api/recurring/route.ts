import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { createRecurringRule, listRecurringRules } from "@/server/services/recurring";

export async function GET() {
  try {
    const { userId } = await requireUser();
    const items = await listRecurringRules(userId);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const payload = await request.json();
    const item = await createRecurringRule(userId, payload);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to create recurring rule" }, { status: 400 });
  }
}
