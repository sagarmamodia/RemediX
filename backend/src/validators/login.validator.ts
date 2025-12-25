import { z } from "zod";

export const LoginSchema = z.object({
  role: z.enum(["Doctor", "Patient"]),
  phone: z.string(),
  password: z.string().min(1, "Password is required"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
