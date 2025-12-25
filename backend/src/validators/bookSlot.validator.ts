import z from "zod";

export const BookSlotSchema = z.object({
  doctorId: z.string(),
  slot: z
    .tuple([z.coerce.date(), z.coerce.date()])
    .transform(([s, e]) => [new Date(s), new Date(e)] as const) // Transform to dates for comparison
    .refine(([start, end]) => {
      const isSameDay =
        start.toISOString().split("T")[0] === end.toISOString().split("T")[0];
      if (!isSameDay) return false;
      if (start >= end) return false;
      const duration = (end.getTime() - start.getTime()) / (1000 * 60);
      if (duration != 30) return false; // the duration of the slots must be 30 minutes
      return true;
    }),
  sourceId: z.string(),
});
