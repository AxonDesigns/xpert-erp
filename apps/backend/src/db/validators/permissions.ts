import 'zod-openapi/extend';
import permissionTable from "@backend/db/schema/permissions";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertPermissionSchema = createInsertSchema(permissionTable);
export const selectPermissionSchema = createSelectSchema(permissionTable);
export const updatePermissionSchema = createUpdateSchema(permissionTable);
