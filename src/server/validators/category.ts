import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Use a hex color"),
  icon: z.string().min(1).max(40),
});

export const categoryUpdateSchema = categorySchema.partial().extend({
  id: z.string().cuid(),
});
