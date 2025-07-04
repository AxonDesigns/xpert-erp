import { id, timestamps } from "@backend/db/lib/utils";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import permissionGroupTable from "./permission-groups";

const permissionTable = pgTable("permissions", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  path: varchar("path", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export default permissionTable;
