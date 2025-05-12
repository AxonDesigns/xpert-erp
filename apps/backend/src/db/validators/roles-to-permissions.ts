import 'zod-openapi/extend';
import roleToPermissionTable from "@backend/db/schema/roles-to-permissions";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const insertRoleToPermissionSchema =
  createInsertSchema(roleToPermissionTable);
export const selectRoleToPermissionSchema =
  createSelectSchema(roleToPermissionTable);
export const updateRoleToPermissionSchema =
  createUpdateSchema(roleToPermissionTable);