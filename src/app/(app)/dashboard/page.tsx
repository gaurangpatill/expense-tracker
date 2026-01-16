import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { monthKey } from "@/lib/dates";
import { getDashboardData } from "@/server/services/analytics";
import { getPreferences } from "@/server/services/preferences";
import { defaultDashboardLayout } from "@/lib/preferences";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.deletedAt) {
    return null;
  }

  const month = monthKey(new Date());
  const [data, preferences] = await Promise.all([
    getDashboardData(userId, month),
    getPreferences(userId),
  ]);
  const layout = (preferences.dashboardLayout as typeof defaultDashboardLayout) ?? defaultDashboardLayout;
  const dashboardData = {
    ...data,
    recentTransactions: data.recentTransactions.map((transaction) => ({
      ...transaction,
      date: transaction.date.toISOString(),
      category: {
        name: transaction.category.name,
        icon: transaction.category.icon,
      },
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-500">Monthly performance snapshot.</p>
      </div>
      <DashboardOverview data={dashboardData} currency={preferences.currency} layout={layout} />
    </div>
  );
}
