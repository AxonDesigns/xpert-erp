import type { insertCurrencySchema, selectCurrencySchema, updateCurrencySchema } from "@backend/db/validators/currencies";
import type { z } from "zod";

export type InsertCurrency = z.infer<typeof insertCurrencySchema>;
export type SelectCurrency = z.infer<typeof selectCurrencySchema>;
export type UpdateCurrency = z.infer<typeof updateCurrencySchema>;