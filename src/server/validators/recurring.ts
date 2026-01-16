import { z } from "zod";

export const recurringSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amountCents: z.number().int().min(1),
  categoryId: z.string().cuid(),
  merchant: z.string().max(120).optional(),
  notes: z.string().max(500).optional(),
  frequency: z.enum(["WEEKLY", "MONTHLY"]),
  interval: z.number().int().min(1).max(12).default(1),
  nextRunAt: z.string().datetime(),
});

export const recurringUpdateSchema = recurringSchema.partial().extend({
  id: z.string().cuid(),
});
