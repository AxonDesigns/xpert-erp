import { id, timestamps } from "../lib/utils";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";

const roleTable = pgTable("roles", {
  id: id().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  ...timestamps,
});


export default roleTable;