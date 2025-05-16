import type { insertLanguageSchema, selectLanguageSchema, updateLanguageSchema } from "@backend/db/validators/languages";
import type { z } from "zod";

export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type SelectLanguage = z.infer<typeof selectLanguageSchema>;
export type UpdateLanguage = z.infer<typeof updateLanguageSchema>;