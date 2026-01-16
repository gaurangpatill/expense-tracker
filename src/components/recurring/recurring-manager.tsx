"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getCategoryIcon } from "@/components/icons/categoryIcons";
import { formatCurrency, parseAmountToCents } from "@/lib/money";

const schema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.string().min(1),
  categoryId: z.string().min(1),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  frequency: z.enum(["WEEKLY", "MONTHLY"]),
  interval: z.string().min(1),
  nextRunAt: z.string().min(1),
});

type Category = { id: string; name: string; icon: string };

type RecurringRule = {
  id: string;
  type: "EXPENSE" | "INCOME";
  amountCents: number;
  merchant?: string | null;
  notes?: string | null;
  frequency: "WEEKLY" | "MONTHLY";
  interval: number;
  nextRunAt: string;
  category: Category;
};

export function RecurringManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "EXPENSE",
      frequency: "MONTHLY",
      interval: "1",
      nextRunAt: new Date().toISOString().slice(0, 16),
    },
  });

  const load = async () => {
    setLoading(true);
    const [categoryRes, ruleRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/recurring"),
    ]);
    if (categoryRes.ok) {
      const data = await categoryRes.json();
      setCategories(data.items);
    }
    if (ruleRes.ok) {
      const data = await ruleRes.json();
      setRules(data.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      type: values.type,
      amountCents: parseAmountToCents(values.amount),
      categoryId: values.categoryId,
      merchant: values.merchant || undefined,
      notes: values.notes || undefined,
      frequency: values.frequency,
      interval: Number(values.interval),
      nextRunAt: new Date(values.nextRunAt).toISOString(),
    };

    const response = await fetch("/api/recurring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to create recurring rule");
      return;
    }

    toast.success("Recurring rule created");
    reset();
    load();
  });

  const runGenerator = async () => {
    const response = await fetch("/api/recurring/generate", { method: "POST" });
    if (!response.ok) {
      toast.error("Unable to generate transactions");
      return;
    }
    const data = await response.json();
    toast.success(`Generated ${data.created} transactions`);
  };

  const deleteRule = async (id: string) => {
    const response = await fetch(`/api/recurring/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to delete rule");
      return;
    }
    toast.success("Recurring rule deleted");
    load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add recurring rule</h2>
          <Button type="button" variant="secondary" onClick={runGenerator}>
            Generate due
          </Button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Select label="Type" error={errors.type?.message} {...register("type")}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </Select>
          <Input label="Amount" placeholder="0.00" error={errors.amount?.message} {...register("amount")} />
          <Select label="Category" error={errors.categoryId?.message} {...register("categoryId")}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input label="Merchant" placeholder="e.g., Spotify" {...register("merchant")} />
          <Input label="Notes" placeholder="Recurring payment" {...register("notes")} />
          <Select label="Frequency" error={errors.frequency?.message} {...register("frequency")}>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </Select>
          <Input label="Interval" placeholder="1" error={errors.interval?.message} {...register("interval")} />
          <Input label="Next run" type="datetime-local" error={errors.nextRunAt?.message} {...register("nextRunAt")} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create rule"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Scheduled recurring</h2>
        {loading ? (
          <p className="mt-6 text-sm text-neutral-500">Loading recurring rules...</p>
        ) : (
          <div className="mt-6 space-y-3">
            {rules.length === 0 ? (
              <p className="text-sm text-neutral-500">No recurring rules yet.</p>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{rule.merchant ?? "Scheduled transaction"}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        {(() => {
                          const Icon = getCategoryIcon(rule.category.icon);
                          return <Icon className="h-3 w-3" aria-hidden />;
                        })()}
                        <span>
                          {rule.category.name} · {rule.frequency} · every {rule.interval} interval
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={rule.type === "EXPENSE" ? "text-sm font-semibold text-rose-600" : "text-sm font-semibold text-emerald-600"}>
                        {rule.type === "EXPENSE" ? "-" : "+"}{formatCurrency(rule.amountCents)}
                      </span>
                      <Button type="button" variant="ghost" onClick={() => deleteRule(rule.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">Next run: {new Date(rule.nextRunAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
