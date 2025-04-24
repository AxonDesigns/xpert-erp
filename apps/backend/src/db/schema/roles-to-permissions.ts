import { id, timestamps } from "@backend/db/lib/utils";
import permissions from "@backend/db/schema/permissions";
import roles from "@backend/db/schema/roles";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";

const rolesToPermissions = pgTable(
  "roles_to_permissions",
  {
    roleId: id("role_id")
      .references(() => roles.id)
      .notNull(),
    permissionId: id("permission_id")
      .references(() => permissions.id)
      .notNull(),
    ...timestamps,
  },
  (table) => [
    primaryKey({
      columns: [table.roleId, table.permissionId],
    }),
  ],
);

export default rolesToPermissions;