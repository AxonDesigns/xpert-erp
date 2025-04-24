import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { id, timestamps } from "@backend/db/lib/utils";
import roles from "@backend/db/schema/roles";

const users = pgTable("users", {
  id: id("id").primaryKey(),
  username: varchar("name", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  roleId: id("role_id")
    .references(() => roles.id)
    .notNull(),
  otpSecret: text("otp_secret"),
  ...timestamps,
});

export default users;
