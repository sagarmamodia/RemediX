import { z } from "zod";

export const ProviderFilterQuerySchema = z.object({
  speciality: z.string().optional(),
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
});

export type ProviderFilterQueryDTO = z.infer<typeof ProviderFilterQuerySchema>;
