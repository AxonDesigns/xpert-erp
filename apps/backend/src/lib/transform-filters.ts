import { getTableColumns } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

export function transformFiltering(value: string, table: PgTable) {
  if (value.trim() === "") return [];

  return value
    .split(",")
    .map((value) => {
      const [field, filter] = value.split(":");
      if (!field || !filter) return null;
      const tableColumns = Object.values(getTableColumns(table)).map(
        (col) => col.name,
      );
      if (!tableColumns.includes(field)) return null;
      return {
        field,
        filter,
      };
    })
    .filter((pair) => pair !== null);
}
