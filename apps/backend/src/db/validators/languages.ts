import 'zod-openapi/extend';
import { languageTable } from "@backend/db/schema/languages";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertLanguageSchema = createInsertSchema(languageTable);
export const selectLanguageSchema = createSelectSchema(languageTable);
export const updateLanguageSchema = createUpdateSchema(languageTable);