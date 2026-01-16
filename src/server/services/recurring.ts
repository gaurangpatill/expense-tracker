import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { calculateNextRun } from "@/lib/recurring";
import { recurringSchema, recurringUpdateSchema } from "@/server/validators/recurring";

export async function listRecurringRules(userId: string) {
  return prisma.recurringRule.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createRecurringRule(userId: string, data: unknown) {
  const parsed = recurringSchema.parse(data);
  const category = await prisma.category.findFirst({
    where: { id: parsed.categoryId, userId },
  });
  if (!category) {
    throw new Error("Invalid category");
  }
  return prisma.recurringRule.create({
    data: {
      ...parsed,
      userId,
      nextRunAt: new Date(parsed.nextRunAt),
    },
  });
}

export async function updateRecurringRule(userId: string, data: unknown) {
  const parsed = recurringUpdateSchema.parse(data);
  if (parsed.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: parsed.categoryId, userId },
    });
    if (!category) {
      throw new Error("Invalid category");
    }
  }
  const result = await prisma.recurringRule.updateMany({
    where: { id: parsed.id, userId },
    data: {
      type: parsed.type,
      amountCents: parsed.amountCents,
      categoryId: parsed.categoryId,
      merchant: parsed.merchant,
      notes: parsed.notes,
      frequency: parsed.frequency,
      interval: parsed.interval,
      nextRunAt: parsed.nextRunAt ? new Date(parsed.nextRunAt) : undefined,
    },
  });

  if (result.count === 0) {
    throw new Error("Recurring rule not found");
  }

  return prisma.recurringRule.findUniqueOrThrow({
    where: { id: parsed.id },
  });
}

export async function deleteRecurringRule(userId: string, id: string) {
  const result = await prisma.recurringRule.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    throw new Error("Recurring rule not found");
  }

  return { ok: true };
}

export async function generateDueRecurring(userId: string) {
  const now = new Date();
  const rules = await prisma.recurringRule.findMany({
    where: { userId, nextRunAt: { lte: now } },
  });

  let createdCount = 0;

  for (const rule of rules) {
    let runAt = rule.nextRunAt;
    let nextRunAt = rule.nextRunAt;

    while (runAt <= now) {
      try {
        await prisma.$transaction(async (tx) => {
          const transaction = await tx.transaction.create({
            data: {
              userId,
              type: rule.type,
              amountCents: rule.amountCents,
              date: runAt,
              categoryId: rule.categoryId,
              merchant: rule.merchant,
              notes: rule.notes,
            },
          });

          await tx.recurringRun.create({
            data: {
              ruleId: rule.id,
              runAt,
              transactionId: transaction.id,
            },
          });
        });

        createdCount += 1;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          // Recurring run already generated for this rule/runAt.
        } else {
          throw error;
        }
      }

      nextRunAt = calculateNextRun(runAt, rule.frequency, rule.interval);
      runAt = nextRunAt;
    }

    await prisma.recurringRule.update({
      where: { id: rule.id },
      data: { nextRunAt },
    });
  }

  return { created: createdCount };
}
