import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/db/prisma";
import { signupSchema } from "@/server/validators/auth";
import { DEFAULT_ACCOUNTS, DEFAULT_CATEGORIES } from "@/server/services/defaults";
import { defaultDashboardLayout } from "@/server/services/preferences";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, confirmPassword } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
    });

    await tx.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({
        ...category,
        userId: created.id,
      })),
    });

    await tx.financialAccount.createMany({
      data: DEFAULT_ACCOUNTS.map((account) => ({
        ...account,
        userId: created.id,
      })),
    });

    await tx.userPreferences.create({
      data: {
        userId: created.id,
        currency: "USD",
        dashboardLayout: defaultDashboardLayout,
      },
    });

    return created;
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
