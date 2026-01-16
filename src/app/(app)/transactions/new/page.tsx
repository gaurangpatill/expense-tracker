import { TransactionForm } from "@/components/transactions/transaction-form";

export default function NewTransactionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New transaction</h1>
        <p className="text-sm text-neutral-500">Capture expenses and income with receipts.</p>
      </div>
      <TransactionForm mode="create" />
    </div>
  );
}
