import { countryToLanguageTable } from "@backend/db/schema/countries-to-languages";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertCountryToLanguageSchema = createInsertSchema(countryToLanguageTable);
export const selectCountryToLanguageSchema = createSelectSchema(countryToLanguageTable);
export const updateCountryToLanguageSchema = createUpdateSchema(countryToLanguageTable);