import 'zod-openapi/extend';
import type { insertCountrySchema, selectCountrySchema, updateCountrySchema } from "@backend/db/validators/countries";
import type { z } from "zod";


export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type SelectCountry = z.infer<typeof selectCountrySchema>;
export type UpdateCountry = z.infer<typeof updateCountrySchema>;