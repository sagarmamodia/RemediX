import { z } from "zod";

export const BookConsultationSchema = z.object({
  providerId: z.string(),
  sourceId: z.string(),
});
