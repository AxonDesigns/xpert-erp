import sessionTable from "@backend/db/schema/sessions";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const selectSessionSchema = createSelectSchema(sessionTable);
export const insertSessionSchema = createInsertSchema(sessionTable, {
  id: (schema) => schema.openapi({ description: "Session's id" }),
  userId: (schema) => schema.openapi({ description: "User's id" }),
  expiresAt: (schema) => schema.openapi({ description: "Session's expiration date" }),
});
export const updateSessionSchema = createUpdateSchema(sessionTable);