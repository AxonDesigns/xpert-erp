import { getTableColumns } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

export function transformSortering(value: string, table: PgTable) {
  if (value.trim() === "") return [];

  const directions = ["asc", "desc"];
  const tableColumns = Object.values(getTableColumns(table)).map(
    (col) => col.name,
  );
  return value
    .split(",")
    .map((pair) => {
      const [field, direction] = pair.split(":");
      if (!field || !direction) return null;

      const validDirection = directions.includes(direction);
      const validField = tableColumns.includes(field);
      if (!validDirection || !validField) return null;

      return {
        field,
        order: direction,
      };
    })
    .filter((pair) => pair !== null);
}
