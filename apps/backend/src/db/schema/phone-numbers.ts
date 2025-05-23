import { id, timestamps } from "@backend/db/lib/utils";
import thirdPartyTable from "@backend/db/schema/third-parties";
import userTable from "@backend/db/schema/users";
import { sql } from "drizzle-orm";
import { check, pgTable, varchar } from "drizzle-orm/pg-core";

const phoneNumberTable = pgTable("phone_numbers", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: id("user_id").references(() => userTable.id),
  thirdPartyId: id("third_party_id").references(() => thirdPartyTable.id, {}),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  ...timestamps,
}, (table) => [
  check("check_at_least_one", sql`${table.userId} IS NOT NULL OR ${table.thirdPartyId} IS NOT NULL`),
  check("check_at_most_one", sql`NOT (${table.userId} IS NOT NULL AND ${table.thirdPartyId} IS NOT NULL)`),
]);

export default phoneNumberTable;
