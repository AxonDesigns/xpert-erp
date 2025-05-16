import 'zod-openapi/extend';
import { currencyTable } from "@backend/db/schema/currencies";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertCurrencySchema = createInsertSchema(currencyTable);
export const selectCurrencySchema = createSelectSchema(currencyTable);
export const updateCurrencySchema = createUpdateSchema(currencyTable);
