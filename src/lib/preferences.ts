export const defaultDashboardLayout = {
  cards: {
    showIncome: true,
    showExpenses: true,
    showNet: true,
  },
  widgets: {
    showDailyExpensesChart: true,
    showSpendByCategory: true,
    showTopMerchants: true,
    showBudgetStatus: true,
    showRecentTransactions: true,
  },
  order: [
    "dailyExpenses",
    "spendByCategory",
    "topMerchants",
    "budgetStatus",
    "recentTransactions",
  ],
};

export type DashboardLayout = typeof defaultDashboardLayout;
