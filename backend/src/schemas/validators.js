import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string({ message: "Password is required" })
});

export const registerSchema = z.object({
  username: z.string({ message: "Username is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z.string({ message: "Password is required" }),
});
