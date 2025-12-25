import { z } from "zod";

export const BookConsultationSchema = z.object({
  doctorId: z.string(),
  sourceId: z.string(),
});
