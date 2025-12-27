import { z } from "zod";

export const LoginSchema = z.object({
  role: z.enum(["Doctor", "Patient"]),
  email: z.email(),
  password: z.string().min(8, "Password is required"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
