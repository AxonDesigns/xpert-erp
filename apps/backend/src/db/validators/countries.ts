import 'zod-openapi/extend';
import { countryTable } from "@backend/db/schema/countries";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertCountrySchema = createInsertSchema(countryTable, {
});

export const selectCountrySchema = createSelectSchema(countryTable, {
});

export const updateCountrySchema = createUpdateSchema(countryTable, {
});