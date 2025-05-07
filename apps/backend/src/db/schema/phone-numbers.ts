import { id, timestamps } from "@backend/db/lib/utils";
import userTable from "@backend/db/schema/users";
import { pgTable, text } from "drizzle-orm/pg-core";

const phoneNumberTable = pgTable("phone_numbers", {
  id: id("id").primaryKey(),
  phoneNumber: text("phone_number").notNull(),
  ...timestamps,
});

export default phoneNumberTable;
