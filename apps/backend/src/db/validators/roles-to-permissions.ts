import rolesToPermissions from "@backend/db/schema/roles-to-permissions";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const insertRoleToPermissionSchema =
  createInsertSchema(rolesToPermissions);
export const selectRoleToPermissionSchema =
  createSelectSchema(rolesToPermissions);
export const updateRoleToPermissionSchema =
  createUpdateSchema(rolesToPermissions);