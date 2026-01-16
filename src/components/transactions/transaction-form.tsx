"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { parseAmountToCents } from "@/lib/money";

const schema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.string().min(1),
  date: z.string().min(1),
  categoryId: z.string().min(1),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
  accountId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Category = { id: string; name: string; color: string; icon: string };

type Account = { id: string; name: string };

type TransactionInitial = {
  type: "EXPENSE" | "INCOME";
  amountCents: number;
  date: string;
  categoryId: string;
  merchant?: string | null;
  notes?: string | null;
  paymentMethod?: string | null;
  accountId?: string | null;
  attachmentId?: string | null;
};

export function TransactionForm({
  mode,
  transactionId,
  initial,
  onSaved,
}: {
  mode: "create" | "edit";
  transactionId?: string;
  initial?: TransactionInitial | null;
  onSaved?: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [attachmentId, setAttachmentId] = useState<string | undefined>(initial?.attachmentId ?? undefined);
  const [uploading, setUploading] = useState(false);

  const defaults = useMemo<FormValues>(
    () => ({
      type: initial?.type ?? "EXPENSE",
      amount: initial ? (initial.amountCents / 100).toFixed(2) : "",
      date: initial ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
      categoryId: initial?.categoryId ?? "",
      merchant: initial?.merchant ?? "",
      notes: initial?.notes ?? "",
      paymentMethod: initial?.paymentMethod ?? "",
      accountId: initial?.accountId ?? "",
    }),
    [initial]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  useEffect(() => {
    const load = async () => {
      const [categoryRes, accountRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/accounts"),
      ]);
      if (categoryRes.ok) {
        const data = await categoryRes.json();
        setCategories(data.items);
      }
      if (accountRes.ok) {
        const data = await accountRes.json();
        setAccounts(data.items);
      }
    };
    load();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      type: values.type,
      amountCents: parseAmountToCents(values.amount),
      date: new Date(values.date).toISOString(),
      categoryId: values.categoryId,
      merchant: values.merchant || undefined,
      notes: values.notes || undefined,
      paymentMethod: values.paymentMethod || undefined,
      accountId: values.accountId || undefined,
      attachmentId,
    };

    const response = await fetch(
      mode === "create" ? "/api/transactions" : `/api/transactions/${transactionId}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to save transaction");
      return;
    }

    toast.success(mode === "create" ? "Transaction created" : "Transaction updated");
    onSaved?.();
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/attachments/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to upload receipt");
      setUploading(false);
      return;
    }

    const payload = await response.json();
    setAttachmentId(payload.item.id);
    toast.success("Receipt attached");
    setUploading(false);
  };

  return (
    <Card>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Type" error={errors.type?.message} {...register("type")}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </Select>
          <Input label="Amount" placeholder="0.00" error={errors.amount?.message} {...register("amount")} />
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <Select label="Category" error={errors.categoryId?.message} {...register("categoryId")}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select label="Account" {...register("accountId")}>
            <option value="">No account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <Input label="Payment method" placeholder="Card, Cash" {...register("paymentMethod")} />
        </div>
        <Input label="Merchant" placeholder="Store or client" {...register("merchant")} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-neutral-700">Notes</span>
          <textarea
            className="min-h-[100px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            {...register("notes")}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-neutral-700">Receipt attachment</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleUpload(file);
              }
            }}
          />
          {attachmentId ? (
            <span className="text-xs text-emerald-600">Receipt attached</span>
          ) : null}
          {uploading ? <span className="text-xs text-neutral-500">Uploading...</span> : null}
        </label>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Create transaction" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
