import type { insertStateSchema, selectStateSchema, updateStateSchema } from "@backend/db/validators/states";
import type { z } from "zod";

export type InsertState = z.infer<typeof insertStateSchema>;
export type SelectState = z.infer<typeof selectStateSchema>;
export type UpdateState = z.infer<typeof updateStateSchema>;