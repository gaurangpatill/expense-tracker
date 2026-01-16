import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1).max(60),
  type: z.string().max(40).optional(),
});
