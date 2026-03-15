"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { Card } from "@/components/ui/card";
import { getCategoryIcon } from "@/components/icons/categoryIcons";
import { formatCurrency } from "@/lib/money";
import type { DashboardLayout } from "@/lib/preferences";

type DashboardData = {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  dailySeries: Array<{ date: string; amountCents: number }>;
  categorySeries: Array<{ name: string; value: number; color: string }>;
  topMerchants: Array<{ name: string; amountCents: number }>;
  budgetStatus: Array<{
    id: string;
    category: { name: string };
    spent: number;
    limitCents: number;
    percent: number;
    overspent: boolean;
  }>;
  recentTransactions: Array<{
    id: string;
    date: string;
    merchant: string | null;
    amountCents: number;
    category: { name: string; icon: string };
    type: "EXPENSE" | "INCOME";
  }>;
};

const defaultOrder = [
  "dailyExpenses",
  "spendByCategory",
  "topMerchants",
  "budgetStatus",
  "recentTransactions",
];

export function DashboardOverview({
  data,
  currency,
  layout,
}: {
  data: DashboardData;
  currency: string;
  layout: DashboardLayout;
}) {
  const format = (value: number) => formatCurrency(value, currency);
  const widgetOrder = layout.order && layout.order.length > 0 ? layout.order : defaultOrder;

  const widgets: Record<string, React.ReactNode> = {
    dailyExpenses: layout.widgets.showDailyExpensesChart ? (
      <Card key="daily-expenses" data-testid="widget-daily-expenses">
        <h2 className="text-lg font-semibold">Daily expenses</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailySeries}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => format(Number(value))} />
              <Tooltip formatter={(value) => format(Number(value))} labelFormatter={(label) => `Date: ${label}`} />
              <Line type="monotone" dataKey="amountCents" stroke="#0f172a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    ) : null,
    spendByCategory: layout.widgets.showSpendByCategory ? (
      <Card key="spend-by-category" data-testid="widget-spend-by-category">
        <h2 className="text-lg font-semibold">Spend by category</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.categorySeries} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                {data.categorySeries.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => format(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    ) : null,
    topMerchants: layout.widgets.showTopMerchants ? (
      <Card key="top-merchants" data-testid="widget-top-merchants">
        <h2 className="text-lg font-semibold">Top merchants</h2>
        <div className="mt-4 space-y-3">
          {data.topMerchants.length === 0 ? (
            <p className="text-sm text-neutral-500">No merchant data yet.</p>
          ) : (
            data.topMerchants.map((merchant) => (
              <div key={merchant.name} className="glass-pill flex items-center justify-between rounded-2xl px-4 py-3">
                <span className="text-sm font-medium">{merchant.name}</span>
                <span className="text-sm font-semibold text-neutral-900">{format(merchant.amountCents)}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    ) : null,
    budgetStatus: layout.widgets.showBudgetStatus ? (
      <Card key="budget-status" data-testid="widget-budget-status">
        <h2 className="text-lg font-semibold">Budget status</h2>
        <div className="mt-4 space-y-3">
          {data.budgetStatus.length === 0 ? (
            <p className="text-sm text-neutral-500">No budgets for this month.</p>
          ) : (
            data.budgetStatus
              .sort((a, b) => b.percent - a.percent)
              .slice(0, 5)
              .map((budget) => (
                <div key={budget.id} className="glass-pill rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{budget.category.name}</p>
                      <p className="text-xs text-neutral-500">
                        {format(budget.spent)} of {format(budget.limitCents)}
                      </p>
                    </div>
                    <span className={budget.overspent ? "text-xs font-semibold text-rose-600" : "text-xs font-semibold text-emerald-600"}>
                      {budget.overspent ? "Over" : `${budget.percent}%`}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>
    ) : null,
    recentTransactions: layout.widgets.showRecentTransactions ? (
      <Card key="recent-transactions" data-testid="widget-recent-transactions">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent transactions</h2>
          <Link href="/transactions" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {data.recentTransactions.length === 0 ? (
            <p className="text-sm text-neutral-500">No recent transactions.</p>
          ) : (
            data.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="glass-pill flex items-center justify-between rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getCategoryIcon(transaction.category.icon);
                    return <Icon className="h-4 w-4 text-neutral-600" aria-hidden />;
                  })()}
                  <div>
                    <p className="text-sm font-semibold">{transaction.merchant ?? "Untitled"}</p>
                    <p className="text-xs text-neutral-500">
                      {transaction.category.name} · {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={transaction.type === "EXPENSE" ? "text-sm font-semibold text-rose-600" : "text-sm font-semibold text-emerald-600"}>
                  {transaction.type === "EXPENSE" ? "-" : "+"}
                  {format(transaction.amountCents)}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    ) : null,
  };

  const widgetList = widgetOrder.map((key) => widgets[key]).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 stagger">
        {layout.cards.showIncome ? (
          <Card data-testid="card-income">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Income</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-600">{format(data.totalIncome)}</p>
          </Card>
        ) : null}
        {layout.cards.showExpenses ? (
          <Card data-testid="card-expenses">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Expenses</p>
            <p className="mt-3 text-2xl font-semibold text-rose-600">{format(data.totalExpenses)}</p>
          </Card>
        ) : null}
        {layout.cards?.showNet !== false ? (
          <Card data-testid="card-net">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Net</p>
            <p className={`mt-3 text-2xl font-semibold ${data.net >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {format(data.net)}
            </p>
          </Card>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 stagger">{widgetList}</div>
    </div>
  );
}
