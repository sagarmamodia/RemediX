import { z } from "zod";

export const CreatePatientSchema = z.object({
  // Basic string validation
  name: z.string().min(2, "Name must be at least 2 characters"),
  profileUrl: z.string().min(2, "Url must have atleast 2 characters"),
  password: z.string().min(8, "password must have minimum of 8 characters"),

  // Email validation
  email: z.email("Invalid email address"),

  // Enums (Fixed values)
  gender: z.enum(["Male", "Female", "Other"]),

  // Optional fields
  phone: z.string().optional(),

  // Dates (Coerce string "2023-01-01" to Date object)
  dob: z.coerce.date(),
});

export type CreatePatientDTO = z.infer<typeof CreatePatientSchema>;
