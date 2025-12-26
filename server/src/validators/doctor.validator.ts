import { z } from "zod";

export const CreateDoctorSchema = z.object({
  // Basic string validation
  name: z.string().min(2, "Name must be at least 2 characters"),
  profileUrl: z.string().min(2, "Url must have atleast 2 characters"),
  phone: z.string(),
  specialty: z.string(),
  password: z.string().min(8, "password must have minimum of 8 characters"),

  // Email validation
  email: z.email("Invalid email address"),

  // Enums (Fixed values)
  gender: z.enum(["Male", "Female", "Other"]),

  // Dates (Coerce string "2023-01-01" to Date object)
  dob: z.coerce.date(),

  // Number validation
  fee: z.coerce.number(),
});

export const UpdateDoctorSchema = z.object({
  name: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  dob: z.coerce.date().optional(),
  specialty: z.string().optional(),
  fee: z.number().optional(),
});

export type CreateDoctorDTO = z.infer<typeof CreateDoctorSchema>;
export type UpdateDoctorDTO = z.infer<typeof UpdateDoctorSchema>;
