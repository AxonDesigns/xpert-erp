import { countryToCurrencyTable } from "@backend/db/schema/countries-to-currencies";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertCountryToCurrencySchema = createInsertSchema(countryToCurrencyTable);
export const selectCountryToCurrencySchema = createSelectSchema(countryToCurrencyTable);
export const updateCountryToCurrencySchema = createUpdateSchema(countryToCurrencyTable);