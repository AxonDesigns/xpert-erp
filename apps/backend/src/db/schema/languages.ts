import { id } from "@backend/db/lib/utils";
import { pgTable, varchar } from "drizzle-orm/pg-core";


export const languageTable = pgTable("languages", {
  id: id("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 2 }).unique(), // ISO-639-1
  name: varchar("name", { length: 64 }),
  nativeName: varchar("native_name", { length: 64 }),
  script: varchar("script", { length: 50 }), // e.g., Latin, Cyrillic, Arabic
});