import type { insertCountryToLanguageSchema, selectCountryToLanguageSchema, updateCountryToLanguageSchema } from "@backend/db/validators/countries-to-languages";
import type { z } from "zod";

export type InsertCountryToLanguage = z.infer<typeof insertCountryToLanguageSchema>;
export type SelectCountryToLanguage = z.infer<typeof selectCountryToLanguageSchema>;
export type UpdateCountryToLanguage = z.infer<typeof updateCountryToLanguageSchema>;