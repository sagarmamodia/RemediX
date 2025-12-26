import { z } from "zod";

export const UploadPrescriptionSchema = z.object({
  consultationId: z.string(),
  prescriptionUrl: z.string(),
});
