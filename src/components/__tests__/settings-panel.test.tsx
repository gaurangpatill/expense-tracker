import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { SettingsPanel } from "@/components/settings/settings-panel";
import { server } from "@/test/msw/server";
import { defaultDashboardLayout } from "@/lib/preferences";

const user = userEvent.setup();

describe("SettingsPanel", () => {
  it("updates currency via API", async () => {
    server.use(
      http.get("/api/preferences", () =>
        HttpResponse.json({ item: { currency: "USD", dashboardLayout: defaultDashboardLayout } })
      ),
      http.patch("/api/preferences/currency", async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ item: { currency: (body as { currency: string }).currency } });
      })
    );

    render(<SettingsPanel />);

    const currencySelect = await screen.findByLabelText(/currency/i);
    await user.selectOptions(currencySelect, "EUR");

    await waitFor(() => {
      expect((currencySelect as HTMLSelectElement).value).toBe("EUR");
    });
  });

  it("toggles dashboard widget", async () => {
    server.use(
      http.get("/api/preferences", () =>
        HttpResponse.json({ item: { currency: "USD", dashboardLayout: defaultDashboardLayout } })
      ),
      http.patch("/api/preferences/dashboard", async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ item: { dashboardLayout: body } });
      })
    );

    render(<SettingsPanel />);

    const toggles = await screen.findAllByTestId("toggle-widget-showTopMerchants");
    await user.click(toggles[0]);

    await waitFor(() => {
      expect((toggles[0] as HTMLInputElement).checked).toBe(false);
    });
  });
});
