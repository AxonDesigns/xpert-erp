import { id } from "@backend/db/lib/utils";
import cityTable from "@backend/db/schema/cities";
import { pgTable, varchar } from "drizzle-orm/pg-core";

const districtTable = pgTable("districts", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  cityId: id("city_id").references(() => cityTable.id).notNull(),
});

export default districtTable;