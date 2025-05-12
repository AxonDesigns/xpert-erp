import { id } from "@backend/db/lib/utils";
import stateTable from "@backend/db/schema/states";
import { pgTable, varchar } from "drizzle-orm/pg-core";

const cityTable = pgTable("cities", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  stateId: id("state_id").references(() => stateTable.id).notNull(),
});

export default cityTable;