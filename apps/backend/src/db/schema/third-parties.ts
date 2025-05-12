import { id, timestamps } from "@backend/db/lib/utils";
import idTypeTable from "@backend/db/schema/id-types";
import personTypeTable from "@backend/db/schema/person-type";
import { pgTable, varchar } from "drizzle-orm/pg-core";

const thirdPartyTable = pgTable("third_parties", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  idTypeId: id("id_type_id").references(() => idTypeTable.id).notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  idNumber: varchar("id_number", { length: 255 }).notNull(),
  legalName: varchar("legal_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  personTypeId: id("person_type_id").references(() => personTypeTable.id),
  ...timestamps,
});

export default thirdPartyTable;
