import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { transactionSchema, transactionUpdateSchema, transactionQuerySchema } from "@/server/validators/transaction";

export async function listTransactions(userId: string, query: Record<string, string | string[] | undefined>) {
  const parsed = transactionQuerySchema.parse(query);
  const where: Prisma.TransactionWhereInput = {
    userId,
  };

  if (parsed.type) {
    where.type = parsed.type;
  }
  if (parsed.categoryId) {
    where.categoryId = parsed.categoryId;
  }
  if (parsed.search) {
    where.OR = [
      { merchant: { contains: parsed.search, mode: "insensitive" } },
      { notes: { contains: parsed.search, mode: "insensitive" } },
    ];
  }
  if (parsed.startDate || parsed.endDate) {
    where.date = {
      gte: parsed.startDate ? new Date(parsed.startDate) : undefined,
      lte: parsed.endDate ? new Date(parsed.endDate) : undefined,
    };
  }
  if (parsed.minAmount || parsed.maxAmount) {
    where.amountCents = {
      gte: parsed.minAmount ?? undefined,
      lte: parsed.maxAmount ?? undefined,
    };
  }

  const orderBy: Prisma.TransactionOrderByWithRelationInput =
    parsed.sort === "date_asc" ? { date: "asc" } : { date: "desc" };
  const skip = (parsed.page - 1) * parsed.pageSize;

  const [items, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      include: { category: true, attachment: true, account: true },
      orderBy,
      skip,
      take: parsed.pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    items,
    total,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}

export async function getTransaction(userId: string, id: string) {
  return prisma.transaction.findFirst({
    where: { id, userId },
    include: { category: true, attachment: true, account: true },
  });
}

export async function createTransaction(userId: string, data: unknown) {
  const parsed = transactionSchema.parse(data);
  const category = await prisma.category.findFirst({
    where: { id: parsed.categoryId, userId },
  });
  if (!category) {
    throw new Error("Invalid category");
  }

  if (parsed.accountId) {
    const account = await prisma.financialAccount.findFirst({
      where: { id: parsed.accountId, userId },
    });
    if (!account) {
      throw new Error("Invalid account");
    }
  }

  if (parsed.attachmentId) {
    const attachment = await prisma.attachment.findFirst({
      where: { id: parsed.attachmentId, userId },
    });
    if (!attachment) {
      throw new Error("Invalid attachment");
    }
  }

  return prisma.transaction.create({
    data: {
      ...parsed,
      userId,
      date: new Date(parsed.date),
    },
  });
}

export async function updateTransaction(userId: string, data: unknown) {
  const parsed = transactionUpdateSchema.parse(data);
  const { id, ...rest } = parsed;

  if (parsed.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: parsed.categoryId, userId },
    });
    if (!category) {
      throw new Error("Invalid category");
    }
  }

  if (parsed.accountId) {
    const account = await prisma.financialAccount.findFirst({
      where: { id: parsed.accountId, userId },
    });
    if (!account) {
      throw new Error("Invalid account");
    }
  }

  if (parsed.attachmentId) {
    const attachment = await prisma.attachment.findFirst({
      where: { id: parsed.attachmentId, userId },
    });
    if (!attachment) {
      throw new Error("Invalid attachment");
    }
  }

  const result = await prisma.transaction.updateMany({
    where: { id, userId },
    data: {
      ...rest,
      date: parsed.date ? new Date(parsed.date) : undefined,
    },
  });

  if (result.count === 0) {
    throw new Error("Transaction not found");
  }

  return prisma.transaction.findUniqueOrThrow({
    where: { id },
  });
}

export async function deleteTransaction(userId: string, id: string) {
  const result = await prisma.transaction.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    throw new Error("Transaction not found");
  }

  return { ok: true };
}
