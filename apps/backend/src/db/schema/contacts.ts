import { id, timestamps } from "@backend/db/lib/utils";
import userTable from "@backend/db/schema/users";
import { pgTable, text } from "drizzle-orm/pg-core";

const contactTable = pgTable("contacts", {
  id: id("id").primaryKey(),

  ...timestamps,
});

export default contactTable;
