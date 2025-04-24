import type { insertRoleToPermissionSchema, selectRoleToPermissionSchema, updateRoleToPermissionSchema } from "@backend/db/validators/roles-to-permissions";
import type { z } from "zod";

export type SelectRoleToPermission = z.infer<
	typeof selectRoleToPermissionSchema
>;
export type InsertRoleToPermission = z.infer<
	typeof insertRoleToPermissionSchema
>;
export type UpdateRoleToPermission = z.infer<
	typeof updateRoleToPermissionSchema
>;
