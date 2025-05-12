import type { insertCitySchema, selectCitySchema, updateCitySchema } from "@backend/db/validators/cities";
import type { z } from "zod";

export type InsertCity = z.infer<typeof insertCitySchema>;
export type SelectCity = z.infer<typeof selectCitySchema>;
export type UpdateCity = z.infer<typeof updateCitySchema>;
