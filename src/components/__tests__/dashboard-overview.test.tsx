import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { defaultDashboardLayout } from "@/lib/preferences";

const baseData = {
  totalIncome: 5000,
  totalExpenses: 2000,
  net: 3000,
  dailySeries: [],
  categorySeries: [],
  topMerchants: [],
  budgetStatus: [],
  recentTransactions: [],
};

describe("DashboardOverview", () => {
  it("hides widgets based on layout", () => {
    const layout = {
      ...defaultDashboardLayout,
      widgets: { ...defaultDashboardLayout.widgets, showTopMerchants: false },
    };

    render(<DashboardOverview data={baseData} currency="USD" layout={layout} />);

    expect(screen.queryByTestId("widget-top-merchants")).toBeNull();
  });

  it("shows cards based on layout", () => {
    const layout = {
      ...defaultDashboardLayout,
      cards: {
        showIncome: true,
        showExpenses: true,
        showNet: false,
      },
    };

    render(<DashboardOverview data={baseData} currency="USD" layout={layout} />);

    expect(screen.queryByTestId("card-net")).toBeNull();
    expect(screen.getByTestId("card-income")).toBeInTheDocument();
  });
});
