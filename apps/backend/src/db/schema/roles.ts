import { id, timestamps } from "@backend/db/lib/utils";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";

const roles = pgTable("roles", {
  id: id().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  ...timestamps,
});


export default roles;