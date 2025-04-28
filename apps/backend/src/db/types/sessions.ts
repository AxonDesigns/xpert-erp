import type { insertSessionSchema, selectSessionSchema, updateSessionSchema } from "@backend/db/validators/sessions";
import type { z } from "zod";

export type Session = z.infer<typeof selectSessionSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;