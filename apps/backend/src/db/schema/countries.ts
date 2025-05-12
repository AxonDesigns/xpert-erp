import { id } from "@backend/db/lib/utils";
import { currencyTable } from "@backend/db/schema/currencies";
import { languageTable } from "@backend/db/schema/languages";
import { pgTable, varchar } from "drizzle-orm/pg-core";

export const countryTable = pgTable("countries", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  isoCodeAlpha2: varchar("iso_code_alpha2", { length: 2 }).notNull().unique(),
  isoCodeAlpha3: varchar("iso_code_alpha3", { length: 3 }).notNull().unique(),
  phoneCode: varchar("phone_code", { length: 3 }).notNull().unique(),
  continent: varchar("continent", { length: 2 }).notNull(),
});
