import type { z } from "zod";
import type { loginSchema } from "../validators/login";

export type Login = z.infer<typeof loginSchema>;
