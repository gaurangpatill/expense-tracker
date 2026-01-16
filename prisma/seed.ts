import bcrypt from "bcrypt";
import { prisma } from "../src/db/prisma";
import { DEFAULT_ACCOUNTS, DEFAULT_CATEGORIES } from "../src/server/services/defaults";
import { defaultDashboardLayout } from "../src/server/services/preferences";

async function main() {
  const email = "demo@expenseflow.app";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash("DemoPass123!", 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      userId: user.id,
    })),
  });

  await prisma.financialAccount.createMany({
    data: DEFAULT_ACCOUNTS.map((account) => ({
      ...account,
      userId: user.id,
    })),
  });

  await prisma.userPreferences.create({
    data: {
      userId: user.id,
      currency: "USD",
      dashboardLayout: defaultDashboardLayout,
    },
  });

  const categories = await prisma.category.findMany({ where: { userId: user.id } });
  const grocery = categories.find((c) => c.name === "Groceries");
  const rent = categories.find((c) => c.name === "Rent");
  const income = categories.find((c) => c.name === "Income");

  if (grocery && rent && income) {
    await prisma.transaction.createMany({
      data: [
        {
          userId: user.id,
          type: "EXPENSE",
          amountCents: 8450,
          date: new Date(),
          categoryId: grocery.id,
          merchant: "Fresh Market",
        },
        {
          userId: user.id,
          type: "EXPENSE",
          amountCents: 120000,
          date: new Date(),
          categoryId: rent.id,
          merchant: "City Apartments",
        },
        {
          userId: user.id,
          type: "INCOME",
          amountCents: 320000,
          date: new Date(),
          categoryId: income.id,
          merchant: "Acme Corp",
        },
      ],
    });

    const month = new Date().toISOString().slice(0, 7);
    await prisma.budget.createMany({
      data: [
        { userId: user.id, month, categoryId: grocery.id, limitCents: 40000 },
        { userId: user.id, month, categoryId: rent.id, limitCents: 150000 },
      ],
    });
  }

  const users = await prisma.user.findMany({ select: { id: true } });
  await Promise.all(
    users.map((existingUser) =>
      prisma.userPreferences.upsert({
        where: { userId: existingUser.id },
        update: {},
        create: {
          userId: existingUser.id,
          currency: "USD",
          dashboardLayout: defaultDashboardLayout,
        },
      })
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
