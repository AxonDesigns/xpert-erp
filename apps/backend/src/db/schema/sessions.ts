import userTable from "@backend/db/schema/users";
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  active: boolean("active").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});

export default sessionTable;