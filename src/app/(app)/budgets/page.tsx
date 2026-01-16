import { BudgetManager } from "@/components/budgets/budget-manager";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <p className="text-sm text-neutral-500">Set monthly limits and track progress.</p>
      </div>
      <BudgetManager />
    </div>
  );
}
