import Image from "next/image";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { getTransaction } from "@/server/services/transactions";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionDeleteButton } from "@/components/transactions/transaction-delete-button";

export default async function TransactionDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const transaction = await getTransaction(session.user.id, params.id);
  if (!transaction) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit transaction</h1>
        <p className="text-sm text-neutral-500">Update details or attach receipts.</p>
      </div>
      <TransactionForm
        mode="edit"
        transactionId={transaction.id}
        initial={{
          type: transaction.type,
          amountCents: transaction.amountCents,
          date: transaction.date.toISOString(),
          categoryId: transaction.categoryId,
          merchant: transaction.merchant,
          notes: transaction.notes,
          paymentMethod: transaction.paymentMethod,
          accountId: transaction.accountId,
          attachmentId: transaction.attachmentId,
        }}
      />
      <TransactionDeleteButton id={transaction.id} />
      {transaction.attachment ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Receipt</h2>
          <Image
            src={transaction.attachment.url}
            alt="Receipt attachment"
            width={900}
            height={600}
            className="mt-4 max-h-80 w-full rounded-xl border border-neutral-200 object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
