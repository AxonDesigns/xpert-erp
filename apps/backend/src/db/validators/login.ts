import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .openapi({ description: "User's email", example: "john@doe.com" }),
  password: z
    .string()
    .openapi({ description: "User's password", example: "Abc1234#" }),
});
