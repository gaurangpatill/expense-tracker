import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/server/services/auth";
import { changePassword } from "@/server/services/users";

const schema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const payload = await request.json();
    const parsed = schema.parse(payload);
    await changePassword(userId, parsed.currentPassword, parsed.newPassword);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
