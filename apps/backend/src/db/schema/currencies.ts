import { id } from "@backend/db/lib/utils";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const currencyTable = pgTable("currencies", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 3 }).unique(), // ISO 4217
  name: varchar("name", { length: 64 }),
  symbol: varchar("symbol", { length: 8 }),
  decimalDigits: integer("decimal_digits"), // fallback to 2 if not provided
});