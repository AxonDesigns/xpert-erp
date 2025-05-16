import type { insertCountryToCurrencySchema, selectCountryToCurrencySchema, updateCountryToCurrencySchema } from "@backend/db/validators/countries-to-currencies";
import type { z } from "zod";

export type InsertCountryToCurrency = z.infer<typeof insertCountryToCurrencySchema>;
export type SelectCountryToCurrency = z.infer<typeof selectCountryToCurrencySchema>;
export type UpdateCountryToCurrency = z.infer<typeof updateCountryToCurrencySchema>;