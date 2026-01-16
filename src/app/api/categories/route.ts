import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { createCategory, listCategories } from "@/server/services/categories";

export async function GET() {
  try {
    const { userId } = await requireUser();
    const categories = await listCategories(userId);
    return NextResponse.json({ items: categories });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const payload = await request.json();
    const category = await createCategory(userId, payload);
    return NextResponse.json({ item: category }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to create category" }, { status: 400 });
  }
}
