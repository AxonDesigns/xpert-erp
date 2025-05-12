import { id, timestamps } from "@backend/db/lib/utils";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";

const personTypeTable = pgTable("person_types", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  ...timestamps,
});

export default personTypeTable;
