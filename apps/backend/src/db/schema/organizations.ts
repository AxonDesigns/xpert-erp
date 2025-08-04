import { pgTable, varchar } from "drizzle-orm/pg-core";
import { id, timestamps } from "@backend/db/lib/utils";

const organizationTable = pgTable("organizations", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  identifier: varchar("identifier", { length: 255 }).unique().notNull(),
  domain: varchar("domain", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  ...timestamps,
});

export default organizationTable;
