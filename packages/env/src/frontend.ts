import { commonEnvSchema } from "@env/common";
import { config } from "dotenv";
import { z } from "zod";
config({
  path: "../../.env",
});

export const envSchema = commonEnvSchema.extend({
  BACKEND_PORT: z.coerce.number().default(3000),
  FRONTEND_PORT: z.coerce.number().default(5173),
  BACKEND_HOST: z.string().default("localhost"),
  FRONTEND_HOST: z.string().default("localhost"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
}).strip();

export type ENV = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
