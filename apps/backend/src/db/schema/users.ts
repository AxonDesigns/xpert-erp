import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { id, timestamps } from "@backend/db/lib/utils";
import roleTable from "@backend/db/schema/roles";

const userTable = pgTable("users", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  roleId: id("role_id")
    .references(() => roleTable.id)
    .notNull(),
  otpSecret: text("otp_secret"),
  ...timestamps,
});

export default userTable;
