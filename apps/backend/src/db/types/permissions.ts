import type { insertPermissionSchema, selectPermissionSchema, updatePermissionSchema } from "@backend/db/validators/permissions";
import type { z } from "zod";

export type SelectPermission = z.infer<typeof selectPermissionSchema>;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type UpdatePermission = z.infer<typeof updatePermissionSchema>;