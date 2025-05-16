import { id } from "@backend/db/lib/utils";
import { countryTable } from "@backend/db/schema/countries";
import { languageTable } from "@backend/db/schema/languages";
import { boolean, pgTable, primaryKey } from "drizzle-orm/pg-core";

export const countryToLanguageTable = pgTable("countries_to_languages", {
  countryId: id("country_id").references(() => countryTable.id).notNull(),
  languageId: id("language_id").references(() => languageTable.id).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  isOfficial: boolean("is_official").notNull().default(false),
}, (table) => [
  primaryKey({
    columns: [table.countryId, table.languageId],
  }),
]);
