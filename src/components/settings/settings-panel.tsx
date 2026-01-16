"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { defaultDashboardLayout, type DashboardLayout } from "@/lib/preferences";

const schema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function SettingsPanel() {
  const [deleting, setDeleting] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [layout, setLayout] = useState<DashboardLayout>(defaultDashboardLayout);
  const [savingLayout, setSavingLayout] = useState(false);
  const [savingCurrency, setSavingCurrency] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const loadPreferences = async () => {
      const response = await fetch("/api/preferences");
      if (response.ok) {
        const data = await response.json();
        setCurrency(data.item.currency);
        setLayout(data.item.dashboardLayout ?? defaultDashboardLayout);
      }
      setLoadingPrefs(false);
    };
    loadPreferences();
  }, []);

  const updateCurrency = async (nextCurrency: string) => {
    setSavingCurrency(true);
    const response = await fetch("/api/preferences/currency", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency: nextCurrency }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to update currency");
      setSavingCurrency(false);
      return;
    }

    setCurrency(nextCurrency);
    toast.success("Currency updated");
    setSavingCurrency(false);
  };

  const saveLayout = async (nextLayout: DashboardLayout) => {
    setSavingLayout(true);
    const response = await fetch("/api/preferences/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextLayout),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to update dashboard");
      setSavingLayout(false);
      return;
    }

    setLayout(nextLayout);
    toast.success("Dashboard updated");
    setSavingLayout(false);
  };

  const resetLayout = async () => {
    setSavingLayout(true);
    const response = await fetch("/api/preferences/reset-dashboard", { method: "POST" });
    if (!response.ok) {
      toast.error("Unable to reset dashboard");
      setSavingLayout(false);
      return;
    }
    setLayout(defaultDashboardLayout);
    toast.success("Dashboard reset to default");
    setSavingLayout(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const response = await fetch("/api/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to update password");
      return;
    }

    toast.success("Password updated");
    reset();
  });

  const deleteAccount = async () => {
    const confirmed = window.confirm("Delete your account? This cannot be undone.");
    if (!confirmed) {
      return;
    }
    setDeleting(true);
    const response = await fetch("/api/settings/delete", { method: "POST" });
    if (!response.ok) {
      toast.error("Unable to delete account");
      setDeleting(false);
      return;
    }
    toast.success("Account deleted");
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <Card>
        <h2 className="text-lg font-semibold">Preferences</h2>
        <div className="mt-6 space-y-4">
          <Select
            label="Currency"
            value={currency}
            disabled={loadingPrefs || savingCurrency}
            onChange={(event) => updateCurrency(event.target.value)}
          >
            {["USD", "INR", "EUR", "GBP", "CAD", "AUD", "JPY"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dashboard customization</h2>
          <Button type="button" variant="secondary" disabled={savingLayout} onClick={resetLayout}>
            Reset to default
          </Button>
        </div>
        <div className="mt-6 space-y-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Cards</p>
            <div className="mt-3 grid gap-3">
              {[
                { key: "showIncome", label: "Show income" },
                { key: "showExpenses", label: "Show expenses" },
                { key: "showNet", label: "Show net" },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={layout.cards[item.key as keyof DashboardLayout["cards"]]}
                    disabled={loadingPrefs || savingLayout}
                    data-testid={`toggle-card-${item.key}`}
                    onChange={(event) =>
                      saveLayout({
                        ...layout,
                        cards: { ...layout.cards, [item.key]: event.target.checked },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Widgets</p>
            <div className="mt-3 grid gap-3">
              {[
                { key: "showDailyExpensesChart", label: "Daily expenses chart" },
                { key: "showSpendByCategory", label: "Spend by category" },
                { key: "showTopMerchants", label: "Top merchants" },
                { key: "showBudgetStatus", label: "Budget status" },
                { key: "showRecentTransactions", label: "Recent transactions" },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={layout.widgets[item.key as keyof DashboardLayout["widgets"]]}
                    disabled={loadingPrefs || savingLayout}
                    data-testid={`toggle-widget-${item.key}`}
                    onChange={(event) =>
                      saveLayout({
                        ...layout,
                        widgets: { ...layout.widgets, [item.key]: event.target.checked },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>
          {savingLayout ? <p className="text-xs text-neutral-500">Saving changes...</p> : null}
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Change password</h2>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="Current password" type="password" error={errors.currentPassword?.message} {...register("currentPassword")} />
          <Input label="New password" type="password" error={errors.newPassword?.message} {...register("newPassword")} />
          <Input label="Confirm new password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Danger zone</h2>
        <p className="mt-2 text-sm text-neutral-500">Deleting your account removes access and hides your data.</p>
        <Button
          type="button"
          variant="danger"
          className="mt-6"
          disabled={deleting}
          onClick={deleteAccount}
        >
          {deleting ? "Deleting..." : "Delete account"}
        </Button>
      </Card>
    </div>
  );
}
