"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function TransactionDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const onDelete = async () => {
    const confirmed = window.confirm("Delete this transaction?");
    if (!confirmed) {
      return;
    }
    const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error ?? "Unable to delete transaction");
      return;
    }
    toast.success("Transaction deleted");
    router.push("/transactions");
  };

  return (
    <Button type="button" variant="ghost" onClick={onDelete}>
      Delete transaction
    </Button>
  );
}
