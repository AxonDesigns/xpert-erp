import { commonEnvSchema } from "@env/common";
import { config } from "dotenv";
import { z } from "zod";
config({
  path: "../../.env",
});

export const envSchema = commonEnvSchema.extend({
  DATABASE_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.coerce.number(),
  ACCESS_TOKEN_COOKIE_SECRET: z.string(),
  TRUSTED_ORIGINS: z.preprocess(
    (rawData) => {
      const data = rawData as string | undefined;
      if (!data) return [];
      if (data === "*") return data;
      return (data as string).split(",").map((url) => url.trim());
    },
    z.union([z.array(z.string().url()), z.string()]),
  ),
}).strip();

export type ENV = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
