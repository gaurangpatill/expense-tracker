import { prisma } from "@/db/prisma";
import { defaultDashboardLayout } from "@/lib/preferences";

export { defaultDashboardLayout };
import { dashboardLayoutSchema } from "@/server/validators/preferences";

export async function getPreferences(userId: string) {
  const prefs = await prisma.userPreferences.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      currency: "USD",
      dashboardLayout: defaultDashboardLayout,
    },
  });

  if (!prefs.dashboardLayout) {
    return prisma.userPreferences.update({
      where: { userId },
      data: { dashboardLayout: defaultDashboardLayout },
    });
  }

  return prefs;
}

export async function updateCurrency(userId: string, currency: string) {
  return prisma.userPreferences.upsert({
    where: { userId },
    update: { currency },
    create: {
      userId,
      currency,
      dashboardLayout: defaultDashboardLayout,
    },
  });
}

export async function updateDashboardLayout(userId: string, layout: unknown) {
  const parsed = dashboardLayoutSchema.parse(layout);
  return prisma.userPreferences.upsert({
    where: { userId },
    update: { dashboardLayout: parsed },
    create: {
      userId,
      currency: "USD",
      dashboardLayout: parsed,
    },
  });
}

export async function resetDashboardLayout(userId: string) {
  return prisma.userPreferences.upsert({
    where: { userId },
    update: { dashboardLayout: defaultDashboardLayout },
    create: {
      userId,
      currency: "USD",
      dashboardLayout: defaultDashboardLayout,
    },
  });
}
