import 'zod-openapi/extend';
import districtTable from "@backend/db/schema/districts";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertDistrictSchema = createInsertSchema(districtTable);

export const selectDistrictSchema = createSelectSchema(districtTable);

export const updateDistrictSchema = createUpdateSchema(districtTable);