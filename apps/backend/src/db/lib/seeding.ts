import db from "@backend/db";
import chalk from "chalk";
import { getTableName, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

interface SeedList<T extends PgTable> {
  table: T;
  data: T["$inferInsert"][];
  findWhere: SQL | undefined;
  filterBy: (found: T["$inferInsert"], value: T["$inferInsert"]) => boolean;
  mapBy: (value: T["$inferInsert"]) => unknown;
};

export const seedList = async <T extends PgTable>(
  {
    table,
    data,
    findWhere,
    filterBy,
    mapBy,
  }: SeedList<T>,
): Promise<T["$inferSelect"][]> => {
  if (data.length === 0) {
    return [];
  }

  console.log(chalk.white.bold(`Seeding ${getTableName(table)}...`));
  const skipped: T["$inferInsert"][] = []

  const inserted = await db.transaction(async (tx) => {
    // @ts-ignore
    const found = await tx.select().from(table).where(findWhere);
    const toInsert: T["$inferInsert"][] = [];
    for (const item of data) {
      if (found.find((r) => filterBy(r, item))) {
        skipped.push(item)
      } else {
        toInsert.push(item)
      }
    }

    if (toInsert.length === 0) {
      return [];
    }

    await tx.insert(table).values(toInsert).returning();
    return toInsert;
  });

  if (inserted.length === 0) {
    console.log(chalk.gray(`Skipped [${skipped.map(mapBy).join(", ")}]`));
  } else {
    console.log(chalk.green(`Inserted [${inserted.map(mapBy).join(", ")}]`));
  }

  return inserted;
};