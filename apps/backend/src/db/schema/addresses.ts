import { id, timestamps } from "@backend/db/lib/utils";
import districtTable from "@backend/db/schema/districts";
import thirdPartyTable from "@backend/db/schema/third-parties";
import userTable from "@backend/db/schema/users";
import { sql } from "drizzle-orm";
import { check, pgTable, varchar } from "drizzle-orm/pg-core";

const addressTable = pgTable("addresses", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: id("user_id").references(() => userTable.id),
  thirdPartyId: id("third_party_id").references(() => thirdPartyTable.id),
  address_line_1: varchar("address_line_1", { length: 255 }).notNull(),
  address_line_2: varchar("address_line_2", { length: 255 }),
  districtId: id("district_id").references(() => districtTable.id),
  postal_code: varchar("postal_code", { length: 255 }).notNull(),
  ...timestamps,
}, (table) => [
  check("check_at_least_one", sql`${table.userId} IS NOT NULL OR ${table.thirdPartyId} IS NOT NULL`),
  check("check_at_most_one", sql`NOT (${table.userId} IS NOT NULL AND ${table.thirdPartyId} IS NOT NULL)`),
]);

export default addressTable;
