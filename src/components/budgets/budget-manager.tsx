"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { getCategoryIcon } from "@/components/icons/categoryIcons";
import { formatCurrency, parseAmountToCents } from "@/lib/money";
const schema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  categoryId: z.string().min(1),
  limit: z.string().min(1),
});

type Category = { id: string; name: string; icon: string };

type BudgetProgress = {
  id: string;
  month: string;
  limitCents: number;
  spent: number;
  percent: number;
  remaining: number;
  overspent: boolean;
  category: Category;
};

export function BudgetManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [items, setItems] = useState<BudgetProgress[]>([]);
  const [editing, setEditing] = useState<BudgetProgress | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ month: string; categoryId: string; limit: string }>({
    resolver: zodResolver(schema),
    defaultValues: { month, limit: "" },
  });

  const load = async () => {
    const [categoryRes, progressRes] = await Promise.all([
      fetch("/api/categories"),
      fetch(`/api/budgets/progress?month=${month}`),
    ]);

    if (categoryRes.ok) {
      const data = await categoryRes.json();
      setCategories(data.items);
    }
    if (progressRes.ok) {
      const data = await progressRes.json();
      setItems(data.items);
    }
  };

  useEffect(() => {
    load();
  }, [month]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      month: values.month,
      categoryId: values.categoryId,
      limitCents: parseAmountToCents(values.limit),
    };

    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to create budget");
      return;
    }

    toast.success("Budget created");
    reset({ month, limit: "", categoryId: "" });
    load();
  });

  const monthLabel = useMemo(() => month, [month]);

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors, isSubmitting: editSubmitting },
    reset: resetEdit,
  } = useForm<{ month: string; categoryId: string; limit: string }>({
    resolver: zodResolver(schema),
  });

  const openEdit = (budget: BudgetProgress) => {
    setEditing(budget);
    resetEdit({
      month: budget.month,
      categoryId: budget.category.id,
      limit: (budget.limitCents / 100).toFixed(2),
    });
  };

  const onUpdate = handleEditSubmit(async (values) => {
    if (!editing) return;
    const response = await fetch(`/api/budgets/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: values.month,
        categoryId: values.categoryId,
        limitCents: parseAmountToCents(values.limit),
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to update budget");
      return;
    }

    toast.success("Budget updated");
    setEditing(null);
    load();
  });

  const deleteBudget = async (id: string) => {
    const response = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to delete budget");
      return;
    }
    toast.success("Budget deleted");
    load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
      <Card>
        <h2 className="text-lg font-semibold">New budget</h2>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input
            label="Month"
            type="month"
            error={errors.month?.message}
            value={monthLabel}
            {...register("month")}
            onChange={(event) => {
              setMonth(event.target.value);
              setValue("month", event.target.value);
            }}
          />
          <Select label="Category" error={errors.categoryId?.message} {...register("categoryId")}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input label="Limit" placeholder="0.00" error={errors.limit?.message} {...register("limit")} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create budget"}
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Budget status</h2>
          <span className="text-xs text-neutral-500">Month {monthLabel}</span>
        </div>
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">No budgets yet.</p>
          ) : (
            items.map((budget) => (
              <div key={budget.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = getCategoryIcon(budget.category.icon);
                        return <Icon className="h-4 w-4 text-neutral-600" aria-hidden />;
                      })()}
                      <p className="text-sm font-semibold">{budget.category.name}</p>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {formatCurrency(budget.spent)} spent · {formatCurrency(budget.limitCents)} limit
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={budget.overspent ? "text-xs font-semibold text-rose-600" : "text-xs font-semibold text-emerald-600"}>
                      {budget.overspent ? "Over budget" : `${budget.percent}%`}
                    </span>
                    <Button type="button" variant="secondary" onClick={() => openEdit(budget)}>
                      Edit
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => deleteBudget(budget.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-white">
                  <div
                    className={`h-2 rounded-full ${budget.overspent ? "bg-rose-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min(100, budget.percent)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit budget">
        <form className="space-y-4" onSubmit={onUpdate}>
          <Input label="Month" type="month" error={editErrors.month?.message} {...registerEdit("month")} />
          <Select label="Category" error={editErrors.categoryId?.message} {...registerEdit("categoryId")}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input label="Limit" error={editErrors.limit?.message} {...registerEdit("limit")} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={editSubmitting}>
              {editSubmitting ? "Updating..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
