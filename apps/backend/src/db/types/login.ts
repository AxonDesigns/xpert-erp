import type { z } from "zod";
import type { loginSchema } from "@backend/db/validators/login";

export type Login = z.infer<typeof loginSchema>;
