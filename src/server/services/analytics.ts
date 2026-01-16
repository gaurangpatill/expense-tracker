import { prisma } from "@/db/prisma";
import { parseMonthKey } from "@/lib/dates";
import { getBudgetProgress } from "@/server/services/budgets";

export async function getDashboardData(userId: string, month: string) {
  const { start, end } = parseMonthKey(month);

  const [incomeAgg, expenseAgg, dailyExpenses, categorySpend, merchants, recentTransactions] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "INCOME", date: { gte: start, lte: end } },
      _sum: { amountCents: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE", date: { gte: start, lte: end } },
      _sum: { amountCents: true },
    }),
    prisma.transaction.findMany({
      where: { userId, type: "EXPENSE", date: { gte: start, lte: end } },
      select: { date: true, amountCents: true },
      orderBy: { date: "asc" },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, type: "EXPENSE", date: { gte: start, lte: end } },
      _sum: { amountCents: true },
    }),
    prisma.transaction.groupBy({
      by: ["merchant"],
      where: { userId, type: "EXPENSE", date: { gte: start, lte: end }, merchant: { not: null } },
      _sum: { amountCents: true },
      orderBy: { _sum: { amountCents: "desc" } },
      take: 5,
    }),
    prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  const categories = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true, color: true },
  });
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const dailyMap = new Map<string, number>();
  for (const item of dailyExpenses) {
    const key = item.date.toISOString().slice(0, 10);
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + item.amountCents);
  }

  const dailySeries = Array.from(dailyMap.entries()).map(([date, amountCents]) => ({
    date,
    amountCents,
  }));

  const categorySeries = categorySpend.map((entry) => ({
    name: categoryMap.get(entry.categoryId)?.name ?? "Unknown",
    value: entry._sum.amountCents ?? 0,
    color: categoryMap.get(entry.categoryId)?.color ?? "#94a3b8",
  }));

  const topMerchants = merchants.map((entry) => ({
    name: entry.merchant ?? "Unknown",
    amountCents: entry._sum.amountCents ?? 0,
  }));

  const budgetStatus = await getBudgetProgress(userId, month);

  const totalIncome = incomeAgg._sum.amountCents ?? 0;
  const totalExpenses = expenseAgg._sum.amountCents ?? 0;

  return {
    totalIncome,
    totalExpenses,
    net: totalIncome - totalExpenses,
    dailySeries,
    categorySeries,
    topMerchants,
    budgetStatus,
    recentTransactions,
  };
}
