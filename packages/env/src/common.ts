import { z } from "zod";

export const commonEnvSchema = z.object({
  BACKEND_PORT: z.coerce.number().default(3000),
  FRONTEND_PORT: z.coerce.number().default(5173),
  BACKEND_HOST: z.string().default("localhost"),
  FRONTEND_HOST: z.string().default("localhost"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});