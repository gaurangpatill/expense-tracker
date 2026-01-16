import { NextResponse } from "next/server";

import { requireUser } from "@/server/services/auth";
import { uploadAttachment } from "@/server/services/attachments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }

    const attachment = await uploadAttachment(userId, file);
    return NextResponse.json({ item: attachment }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
