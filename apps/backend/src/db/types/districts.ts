import type { insertDistrictSchema, selectDistrictSchema, updateDistrictSchema } from "@backend/db/validators/districts";
import type { z } from "zod";

export type InsertDistrict = z.infer<typeof insertDistrictSchema>;
export type SelectDistrict = z.infer<typeof selectDistrictSchema>;
export type UpdateDistrict = z.infer<typeof updateDistrictSchema>;