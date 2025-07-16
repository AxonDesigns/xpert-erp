import {
  selectRoleSchema,
  type insertRoleSchema,
  type updateRoleSchema,
} from "@backend/db/validators/roles";
import type { z } from "zod";

export type SelectRole = z.infer<typeof selectRoleSchema>;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type UpdateRole = z.infer<typeof updateRoleSchema>;

export const columns = Object.keys(selectRoleSchema.shape).map((key) => ({
  id: key,
  label: key,
  default: key === "name",
}));
