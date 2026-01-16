import { z } from "zod";

export const budgetSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be YYYY-MM"),
  categoryId: z.string().cuid(),
  limitCents: z.number().int().min(1),
});

export const budgetUpdateSchema = budgetSchema.partial().extend({
  id: z.string().cuid(),
});
