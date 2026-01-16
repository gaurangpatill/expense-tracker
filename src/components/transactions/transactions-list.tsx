"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getCategoryIcon } from "@/components/icons/categoryIcons";
import { formatCurrency } from "@/lib/money";

const pageSize = 10;

type Category = { id: string; name: string; icon: string };

type Transaction = {
  id: string;
  type: "EXPENSE" | "INCOME";
  amountCents: number;
  date: string;
  merchant?: string | null;
  notes?: string | null;
  category: Category;
};

export function TransactionsList() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    categoryId: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    sort: "date_desc",
  });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (filters.search) params.set("search", filters.search);
    if (filters.type) params.set("type", filters.type);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.startDate) params.set("startDate", new Date(filters.startDate).toISOString());
    if (filters.endDate) params.set("endDate", new Date(filters.endDate).toISOString());
    const minAmount = Number(filters.minAmount);
    if (!Number.isNaN(minAmount) && filters.minAmount) {
      params.set("minAmount", String(minAmount * 100));
    }
    const maxAmount = Number(filters.maxAmount);
    if (!Number.isNaN(maxAmount) && filters.maxAmount) {
      params.set("maxAmount", String(maxAmount * 100));
    }
    params.set("sort", filters.sort);
    return params;
  }, [filters, page]);

  useEffect(() => {
    const load = async () => {
      const [transactionRes, categoryRes, prefsRes] = await Promise.all([
        fetch(`/api/transactions?${query.toString()}`),
        fetch("/api/categories"),
        fetch("/api/preferences"),
      ]);
      if (transactionRes.ok) {
        const data = await transactionRes.json();
        setItems(data.items);
        setTotal(data.total);
      }
      if (categoryRes.ok) {
        const data = await categoryRes.json();
        setCategories(data.items);
      }
      if (prefsRes.ok) {
        const data = await prefsRes.json();
        setCurrency(data.item.currency ?? "USD");
      }
    };
    load();
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-sm text-neutral-500">Review, filter, and update your cash flow.</p>
        </div>
        <Link href="/transactions/new">
          <Button>New transaction</Button>
        </Link>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Search"
            placeholder="Merchant or notes"
            value={filters.search}
            onChange={(event) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, search: event.target.value }));
            }}
          />
          <Select
            label="Type"
            value={filters.type}
            onChange={(event) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, type: event.target.value }));
            }}
          >
            <option value="">All</option>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </Select>
          <Select
            label="Category"
            value={filters.categoryId}
            onChange={(event) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, categoryId: event.target.value }));
            }}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input
            label="Start date"
            type="date"
            value={filters.startDate}
            onChange={(event) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, startDate: event.target.value }));
            }}
          />
          <Input
            label="End date"
            type="date"
            value={filters.endDate}
            onChange={(event) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, endDate: event.target.value }));
            }}
          />
          <Select
            label="Sort"
            value={filters.sort}
            onChange={(event) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, sort: event.target.value }));
            }}
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
          </Select>
          <Input
            label="Min amount"
            placeholder="0.00"
            value={filters.minAmount}
            onChange={(event) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, minAmount: event.target.value }));
            }}
          />
          <Input
            label="Max amount"
            placeholder="1000.00"
            value={filters.maxAmount}
            onChange={(event) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, maxAmount: event.target.value }));
            }}
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">Showing {items.length} of {total}</p>
        </div>
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">No transactions yet.</p>
          ) : (
            items.map((transaction) => (
              <Link
                key={transaction.id}
                href={`/transactions/${transaction.id}`}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition hover:border-neutral-300"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getCategoryIcon(transaction.category.icon);
                    return <Icon className="h-4 w-4 text-neutral-600" aria-hidden />;
                  })()}
                  <div>
                    <p className="text-sm font-semibold">
                      {transaction.merchant || "Untitled"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {transaction.category.name} · {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={transaction.type === "EXPENSE" ? "text-sm font-semibold text-rose-600" : "text-sm font-semibold text-emerald-600"}>
                    {transaction.type === "EXPENSE" ? "-" : "+"}{formatCurrency(transaction.amountCents, currency)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <span className="text-xs text-neutral-500">Page {page} of {totalPages}</span>
          <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
