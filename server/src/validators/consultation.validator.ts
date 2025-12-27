import { z } from "zod";

export const UpdateConsultationSchema = z.object({
  consultationId: z.string(),
  symptoms: z.string(),
});

export type UpdateConsultationDTO = z.infer<typeof UpdateConsultationSchema>;
