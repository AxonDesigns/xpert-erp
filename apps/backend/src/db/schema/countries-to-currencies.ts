import { id } from "@backend/db/lib/utils";
import { countryTable } from "@backend/db/schema/countries";
import { currencyTable } from "@backend/db/schema/currencies";
import { boolean, pgTable, primaryKey } from "drizzle-orm/pg-core";

export const countryToCurrencyTable = pgTable("countries_to_currencies", {
  countryId: id("country_id").references(() => countryTable.id),
  currencyId: id("currency_id").references(() => currencyTable.id),
  isDefault: boolean("is_default").notNull().default(false),
  isOfficial: boolean("is_official").notNull().default(false),
}, (table) => [
  primaryKey({
    columns: [table.countryId, table.currencyId],
  }),
]);
