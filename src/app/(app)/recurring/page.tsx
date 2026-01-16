import { RecurringManager } from "@/components/recurring/recurring-manager";

export default function RecurringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Recurring</h1>
        <p className="text-sm text-neutral-500">Automate regular bills and income.</p>
      </div>
      <RecurringManager />
    </div>
  );
}
