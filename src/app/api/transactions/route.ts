import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { createTransaction, listTransactions } from "@/server/services/transactions";

export async function GET(request: Request) {
  try {
    const { userId } = await requireUser();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const result = await listTransactions(userId, query);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const payload = await request.json();
    const transaction = await createTransaction(userId, payload);
    return NextResponse.json({ item: transaction }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to create transaction" }, { status: 400 });
  }
}
