import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { resetDashboardLayout } from "@/server/services/preferences";

export async function POST() {
  try {
    const { userId } = await requireUser();
    const prefs = await resetDashboardLayout(userId);
    return NextResponse.json({ item: prefs });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
