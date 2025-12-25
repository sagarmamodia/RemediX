import z from "zod";

export const BookSlotSchema = z.object({
  doctorId: z.string(),
  slot: z
    .tuple([z.coerce.date(), z.coerce.date()])
    .transform(([s, e]) => [new Date(s), new Date(e)] as const) // Transform to dates for comparison
    .refine(([start, end]) => {
      const isSameDay =
        start.toISOString().split("T")[0] === end.toISOString().split("T")[0];
      return isSameDay && start < end;
    }),
  sourceId: z.string(),
});
