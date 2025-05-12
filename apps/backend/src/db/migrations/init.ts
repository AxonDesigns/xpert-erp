import db from "@backend/db";
import cityTable from "@backend/db/schema/cities";
import { countryTable } from "@backend/db/schema/countries";
import districtTable from "@backend/db/schema/districts";
import permissionTable from "@backend/db/schema/permissions";
import roleTable from "@backend/db/schema/roles";
import roleToPermissionTable from "@backend/db/schema/roles-to-permissions";
import stateTable from "@backend/db/schema/states";
import type { InsertCity } from "@backend/db/types/cities";
import type { InsertCountry } from "@backend/db/types/countries";
import type { InsertDistrict } from "@backend/db/types/districts";
import type { InsertPermission } from "@backend/db/types/permissions";
import type { InsertRole } from "@backend/db/types/roles";
import type { InsertRoleToPermission } from "@backend/db/types/roles-to-permissions";
import type { InsertState } from "@backend/db/types/states";
import chalk from "chalk";
import { getTableName, inArray, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

const roles: InsertRole[] = [
  {
    name: "admin",
    description: "Administrator",
  },
  {
    name: "employee",
    description: "Employee",
  },
  {
    name: "manager",
    description: "Manager",
  },
]

const permissions: (InsertPermission & { roles: string[] })[] = [
  {
    name: "total_control",
    description: "Total control over the system",
    roles: ["admin"],
  },
]

const countries: InsertCountry[] = [
  {
    name: "United States",
    isoCodeAlpha2: "US",
    isoCodeAlpha3: "USA",
    continent: "na",
    phoneCode: "+1",
  },
  {
    name: "Colombia",
    isoCodeAlpha2: "CO",
    isoCodeAlpha3: "COL",
    continent: "sa",
    phoneCode: "+57",
  },
]

const states: { name: InsertState["name"], country: string }[] = [
  {
    name: "New York",
    country: "United States",
  },
  {
    name: "Norte de Santander",
    country: "Colombia",
  },
]

const cities: { name: InsertCity["name"], state: string }[] = [
  {
    name: "New York",
    state: "New York",
  },
  {
    name: "Cúcuta",
    state: "Norte de Santander",
  },
]

const districts: { name: InsertDistrict["name"], city: string }[] = [
  {
    name: "Brooklyn",
    city: "New York",
  },
  {
    name: "Los Patios",
    city: "Cúcuta",
  }
]

interface SeedList<T extends PgTable> {
  table: T;
  data: T["$inferInsert"][];
  findWhere: SQL;
  filterBy: (found: T["$inferInsert"], value: T["$inferInsert"]) => boolean;
  mapBy: (value: T["$inferInsert"]) => unknown;
}

const seedList = async <T extends PgTable>(
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
}

const init = async () => {
  console.log(chalk.blue.bold("Starting data initialization..."));

  await seedList({
    table: roleTable,
    data: roles,
    findWhere: inArray(roleTable.name, roles.map((r) => r.name)),
    filterBy: (found, value) => found.name === value.name,
    mapBy: (value) => value.name
  });

  await seedList({
    table: permissionTable,
    data: permissions.map(e => ({
      name: e.name,
      description: e.description,
    })),
    findWhere: inArray(permissionTable.name, permissions.map((r) => r.name)),
    filterBy: (found, value) => found.name === value.name,
    mapBy: (value) => value.name
  });

  console.log(chalk.white.bold("Seeding roles-to-permissions..."));
  await db.transaction(async (tx) => {
    const savedRoles = await tx.select().from(roleTable);
    const savedPermissions = await tx.select().from(permissionTable);

    const relations: InsertRoleToPermission[] = [];

    for (const permission of permissions) {
      for (const role of permission.roles) {
        const roleId = savedRoles.find((r) => r.name === role);
        const permissionId = savedPermissions.find((r) => r.name === permission.name);
        if (!roleId || !permissionId) continue;
        relations.push({
          roleId: roleId.id,
          permissionId: permissionId.id,
        });
      }
    }

    const existingRelations = await tx.select().from(roleToPermissionTable);

    const skippedRelations: InsertRoleToPermission[] = [];
    const toInsertRelations: InsertRoleToPermission[] = [];

    for (const relation of relations) {
      if (existingRelations.find((r) => r.roleId === relation.roleId && r.permissionId === relation.permissionId)) {
        skippedRelations.push(relation);
      } else {
        toInsertRelations.push(relation);
      }
    }

    if (toInsertRelations.length === 0) {
      console.log(chalk.gray(`Skipped [${skippedRelations.map(r => `${r.roleId}-${r.permissionId}`).join(", ")}]`));
      return;
    }

    const insertedRolesToPermissions = await tx.insert(roleToPermissionTable).values(toInsertRelations).returning();

    if (insertedRolesToPermissions.length === 0) {
      console.log(chalk.gray(`Skipped [${skippedRelations.map(r => `${r.roleId}-${r.permissionId}`).join(", ")}]`));
    } else {
      console.log(chalk.green(`Inserted [${insertedRolesToPermissions.map(r => `${r.roleId}-${r.permissionId}`).join(", ")}]`));
    }
  });

  await seedList({
    table: countryTable,
    data: countries,
    findWhere: inArray(countryTable.name, countries.map((r) => r.name)),
    filterBy: (found, value) => found.name === value.name,
    mapBy: (value) => value.name
  });

  const existingCountries = await db.select().from(countryTable);
  const statesToInsert: InsertState[] = [];
  for (const state of states) {
    const country = existingCountries.find((r) => r.name === state.country);
    if (!country) continue;
    statesToInsert.push({
      name: state.name,
      countryId: country.id,
    });
  }

  await seedList({
    table: stateTable,
    data: statesToInsert,
    findWhere: inArray(stateTable.name, states.map((r) => r.name)),
    filterBy: (found, value) => found.name === value.name,
    mapBy: (value) => value.name
  });

  const existingStates = await db.select().from(stateTable);
  const citiesToInsert: InsertCity[] = [];
  for (const city of cities) {
    const state = existingStates.find((r) => r.name === city.state);
    if (!state) continue;
    citiesToInsert.push({
      name: city.name,
      stateId: state.id,
    });
  }

  await seedList({
    table: cityTable,
    data: citiesToInsert,
    findWhere: inArray(cityTable.name, cities.map((r) => r.name)),
    filterBy: (found, value) => found.name === value.name,
    mapBy: (value) => value.name
  });

  const existingCities = await db.select().from(cityTable);
  const districtsToInsert: InsertDistrict[] = [];
  for (const district of districts) {
    const city = existingCities.find((r) => r.name === district.city);
    if (!city) continue;
    districtsToInsert.push({
      name: district.name,
      cityId: city.id,
    });
  }

  await seedList({
    table: districtTable,
    data: districtsToInsert,
    findWhere: inArray(districtTable.name, districts.map((r) => r.name)),
    filterBy: (found, value) => found.name === value.name,
    mapBy: (value) => value.name
  });

  console.log(chalk.white.bold("Seeding completed!"));

  process.exit(0);
};

init();