import { beforeEach, describe, expect, it } from "vitest";

import { getPreferences, updateCurrency, updateDashboardLayout } from "@/server/services/preferences";
import { defaultDashboardLayout } from "@/lib/preferences";
import { resetDb, seedUser } from "@/test/db/helpers";

describe("preferences service", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("creates defaults when missing", async () => {
    const user = await seedUser();
    const prefs = await getPreferences(user.id);
    expect(prefs.currency).toBe("USD");
  });

  it("updates currency", async () => {
    const user = await seedUser();
    const prefs = await updateCurrency(user.id, "EUR");
    expect(prefs.currency).toBe("EUR");
  });

  it("updates dashboard layout", async () => {
    const user = await seedUser();
    const nextLayout = {
      ...defaultDashboardLayout,
      widgets: { ...defaultDashboardLayout.widgets, showTopMerchants: false },
    };
    const prefs = await updateDashboardLayout(user.id, nextLayout);
    expect((prefs.dashboardLayout as typeof defaultDashboardLayout).widgets.showTopMerchants).toBe(false);
  });
});
