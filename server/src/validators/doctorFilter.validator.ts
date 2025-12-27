import { z } from "zod";
import { availableSpecialties } from "./doctor.validator";

export const DoctorFilterQuerySchema = z.object({
  specialty: z.enum(availableSpecialties),
  name: z.string().optional(),
  fee: z
    .preprocess(
      // 1. TRANSFORMER: Runs BEFORE validation
      (input) => {
        // If input is a string "100,500", split it
        if (typeof input === "string") {
          return input.split(",").map((val) => Number(val.trim()));
        }
        return input; // Pass through if it's already an array (rare in simple query parsing)
      },
      // 2. VALIDATOR: Runs on the transformed data
      z
        .tuple([
          z.number().min(0, "Min fee must be positive"), // First element (Min)
          z.number().positive("Max fee must be positive"), // Second element (Max)
        ])
        .refine((data) => data[0] <= data[1], {
          message: "Minimum fee cannot be greater than maximum fee",
        })
    )
    .optional(),
  available: z
    .preprocess(
      // Transform the string to boolean first
      (val) => {
        if (typeof val === "string") {
          const lower = val.toLowerCase();
          if (lower === "true") return true;
          if (lower === "false") return false;
        }
        return val;
      },
      z.boolean()
    )
    .optional(),
});

export type DoctorFilterQueryDTO = z.infer<typeof DoctorFilterQuerySchema>;
