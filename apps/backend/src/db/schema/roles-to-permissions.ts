import { id, timestamps } from "@backend/db/lib/utils";
import permissionTable from "@backend/db/schema/permissions";
import roleTable from "@backend/db/schema/roles";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";

const roleToPermissionTable = pgTable(
  "roles_to_permissions",
  {
    roleId: id("role_id")
      .references(() => roleTable.id)
      .notNull(),
    permissionId: id("permission_id")
      .references(() => permissionTable.id)
      .notNull(),
    ...timestamps,
  },
  (table) => [
    primaryKey({
      columns: [table.roleId, table.permissionId],
    }),
  ],
);

export default roleToPermissionTable;