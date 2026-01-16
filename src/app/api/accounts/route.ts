import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { createAccount, listAccounts } from "@/server/services/accounts";
import { accountSchema } from "@/server/validators/account";

export async function GET() {
  try {
    const { userId } = await requireUser();
    const items = await listAccounts(userId);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const payload = await request.json();
    const parsed = accountSchema.parse(payload);
    const item = await createAccount(userId, parsed);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to create account" }, { status: 400 });
  }
}
