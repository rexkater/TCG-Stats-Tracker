import { z } from "zod";

export const entrySchema = z.object({
  projectId: z.string().cuid(),
  myDeckId: z.string().cuid(),
  oppDeckId: z.string().cuid(),
  categoryId: z.string().cuid().optional(),
  battlefield: z.string().optional(),
  result: z.enum(["WIN", "LOSS", "DRAW"]),
  myScore: z.number().optional().transform(v => (v === undefined ? v : Number(v.toFixed(1)))),
  oppScore: z.number().optional().transform(v => (v === undefined ? v : Number(v.toFixed(1))))
});
