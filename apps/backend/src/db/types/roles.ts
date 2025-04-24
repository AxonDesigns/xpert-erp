import type { insertRoleSchema, selectRoleSchema, updateRoleSchema } from "@backend/db/validators/roles";
import type { z } from "zod";

export type SelectRole = z.infer<typeof selectRoleSchema>;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type UpdateRole = z.infer<typeof updateRoleSchema>;