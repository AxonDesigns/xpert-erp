import { id } from "@backend/db/lib/utils";
import { countryTable } from "@backend/db/schema/countries";
import { pgTable, varchar } from "drizzle-orm/pg-core";

const stateTable = pgTable("states", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  countryId: id("country_id").references(() => countryTable.id).notNull(),
});

export default stateTable;