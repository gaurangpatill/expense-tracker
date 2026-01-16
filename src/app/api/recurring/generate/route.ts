import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { generateDueRecurring } from "@/server/services/recurring";

export async function POST() {
  try {
    const { userId } = await requireUser();
    const result = await generateDueRecurring(userId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
