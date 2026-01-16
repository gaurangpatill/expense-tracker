import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { updateCurrency } from "@/server/services/preferences";
import { currencySchema } from "@/server/validators/preferences";

export async function PATCH(request: Request) {
  try {
    const { userId } = await requireUser();
    const payload = await request.json();
    const parsed = currencySchema.parse(payload);
    const prefs = await updateCurrency(userId, parsed.currency);
    return NextResponse.json({ item: prefs });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
