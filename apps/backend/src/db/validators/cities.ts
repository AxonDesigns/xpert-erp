import 'zod-openapi/extend';
import cityTable from "@backend/db/schema/cities";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertCitySchema = createInsertSchema(cityTable);

export const selectCitySchema = createSelectSchema(cityTable);

export const updateCitySchema = createUpdateSchema(cityTable);