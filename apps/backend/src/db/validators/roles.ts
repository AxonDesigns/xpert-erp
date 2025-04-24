import roles from "@backend/db/schema/roles";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertRoleSchema = createInsertSchema(roles);
export const selectRoleSchema = createSelectSchema(roles);
export const updateRoleSchema = createUpdateSchema(roles);