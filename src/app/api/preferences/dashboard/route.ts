import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { updateDashboardLayout } from "@/server/services/preferences";
import { dashboardLayoutSchema } from "@/server/validators/preferences";

export async function PATCH(request: Request) {
  try {
    const { userId } = await requireUser();
    const payload = await request.json();
    const parsed = dashboardLayoutSchema.parse(payload);
    const prefs = await updateDashboardLayout(userId, parsed);
    return NextResponse.json({ item: prefs });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
