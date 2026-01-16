import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amountCents: z.number().int().min(1),
  date: z.string().datetime(),
  categoryId: z.string().cuid(),
  merchant: z.string().max(120).optional(),
  notes: z.string().max(500).optional(),
  paymentMethod: z.string().max(80).optional(),
  accountId: z.string().cuid().optional(),
  attachmentId: z.string().cuid().optional(),
});

export const transactionUpdateSchema = transactionSchema.partial().extend({
  id: z.string().cuid(),
});

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  type: z.enum(["EXPENSE", "INCOME"]).optional(),
  categoryId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.coerce.number().int().optional(),
  maxAmount: z.coerce.number().int().optional(),
  sort: z.enum(["date_desc", "date_asc"]).default("date_desc"),
});
