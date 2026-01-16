import { prisma } from "@/db/prisma";

export async function listAccounts(userId: string) {
  return prisma.financialAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createAccount(userId: string, data: { name: string; type?: string }) {
  return prisma.financialAccount.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
    },
  });
}

export async function deleteAccount(userId: string, id: string) {
  const count = await prisma.transaction.count({
    where: { userId, accountId: id },
  });
  if (count > 0) {
    return { ok: false, error: "Account has transactions. Reassign first." };
  }

  const result = await prisma.financialAccount.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) {
    return { ok: false, error: "Account not found" };
  }

  return { ok: true };
}
