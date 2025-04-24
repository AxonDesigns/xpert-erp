import permissions from "@backend/db/schema/permissions";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertPermissionSchema = createInsertSchema(permissions);
export const selectPermissionSchema = createSelectSchema(permissions);
export const updatePermissionSchema = createUpdateSchema(permissions);
