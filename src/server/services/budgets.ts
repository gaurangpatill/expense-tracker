import { prisma } from "@/db/prisma";
import { parseMonthKey } from "@/lib/dates";
import { budgetSchema, budgetUpdateSchema } from "@/server/validators/budget";

export async function listBudgets(userId: string, month?: string) {
  return prisma.budget.findMany({
    where: { userId, month },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createBudget(userId: string, data: unknown) {
  const parsed = budgetSchema.parse(data);
  const category = await prisma.category.findFirst({
    where: { id: parsed.categoryId, userId },
  });
  if (!category) {
    throw new Error("Invalid category");
  }
  return prisma.budget.create({
    data: {
      ...parsed,
      userId,
    },
  });
}

export async function updateBudget(userId: string, data: unknown) {
  const parsed = budgetUpdateSchema.parse(data);
  if (parsed.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: parsed.categoryId, userId },
    });
    if (!category) {
      throw new Error("Invalid category");
    }
  }
  const result = await prisma.budget.updateMany({
    where: { id: parsed.id, userId },
    data: {
      month: parsed.month,
      categoryId: parsed.categoryId,
      limitCents: parsed.limitCents,
    },
  });

  if (result.count === 0) {
    throw new Error("Budget not found");
  }

  return prisma.budget.findUniqueOrThrow({
    where: { id: parsed.id },
  });
}

export async function deleteBudget(userId: string, id: string) {
  const result = await prisma.budget.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    throw new Error("Budget not found");
  }

  return { ok: true };
}

export async function getBudgetProgress(userId: string, month: string) {
  const { start, end } = parseMonthKey(month);
  const budgets = await prisma.budget.findMany({
    where: { userId, month },
    include: { category: true },
  });

  const spendByCategory = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      type: "EXPENSE",
      date: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      amountCents: true,
    },
  });

  const spentMap = new Map(
    spendByCategory.map((entry) => [entry.categoryId, entry._sum.amountCents ?? 0])
  );

  return budgets.map((budget) => {
    const spent = spentMap.get(budget.categoryId) ?? 0;
    const percent = budget.limitCents > 0 ? Math.round((spent / budget.limitCents) * 100) : 0;
    return {
      ...budget,
      spent,
      percent,
      remaining: budget.limitCents - spent,
      overspent: spent > budget.limitCents,
    };
  });
}
