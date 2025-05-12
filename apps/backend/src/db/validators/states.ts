import 'zod-openapi/extend';
import stateTable from "@backend/db/schema/states";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertStateSchema = createInsertSchema(stateTable);

export const selectStateSchema = createSelectSchema(stateTable);

export const updateStateSchema = createUpdateSchema(stateTable);