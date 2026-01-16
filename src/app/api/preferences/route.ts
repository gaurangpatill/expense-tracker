import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { getPreferences } from "@/server/services/preferences";

export async function GET() {
  try {
    const { userId } = await requireUser();
    const prefs = await getPreferences(userId);
    return NextResponse.json({ item: prefs });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
