import { z } from "zod";

export const currencySchema = z.object({
  currency: z.enum(["USD", "INR", "EUR", "GBP", "CAD", "AUD", "JPY"]),
});

const dashboardCardsSchema = z.object({
  showIncome: z.boolean(),
  showExpenses: z.boolean(),
  showNet: z.boolean(),
});

const dashboardWidgetsSchema = z.object({
  showDailyExpensesChart: z.boolean(),
  showSpendByCategory: z.boolean(),
  showTopMerchants: z.boolean(),
  showBudgetStatus: z.boolean(),
  showRecentTransactions: z.boolean(),
});

export const dashboardLayoutSchema = z.object({
  cards: dashboardCardsSchema,
  widgets: dashboardWidgetsSchema,
  order: z.array(z.string()).optional(),
});
