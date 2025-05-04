import sessionTable from "@backend/db/schema/sessions";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const selectSessionSchema = createSelectSchema(sessionTable);
export const insertSessionSchema = createInsertSchema(sessionTable, {
  id: (schema) => schema,
  userId: (schema) => schema,
  expiresAt: (schema) => schema,
});
export const updateSessionSchema = createUpdateSchema(sessionTable);