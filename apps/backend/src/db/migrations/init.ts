import db from "@backend/db";
import { seedList } from "@backend/db/lib/seeding";
import cityTable from "@backend/db/schema/cities";
import { countryTable } from "@backend/db/schema/countries";
import { countryToCurrencyTable } from "@backend/db/schema/countries-to-currencies";
import { countryToLanguageTable } from "@backend/db/schema/countries-to-languages";
import { currencyTable } from "@backend/db/schema/currencies";
import districtTable from "@backend/db/schema/districts";
import { languageTable } from "@backend/db/schema/languages";
import permissionTable from "@backend/db/schema/permissions";
import roleTable from "@backend/db/schema/roles";
import roleToPermissionTable from "@backend/db/schema/roles-to-permissions";
import stateTable from "@backend/db/schema/states";
import userTable from "@backend/db/schema/users";
import type { InsertCity } from "@backend/db/types/cities";
import type { InsertCountry } from "@backend/db/types/countries";
import type { InsertCountryToCurrency } from "@backend/db/types/countries-to-currencies";
import type { InsertCountryToLanguage } from "@backend/db/types/countries-to-languages";
import type { InsertCurrency } from "@backend/db/types/currencies";
import type { InsertDistrict } from "@backend/db/types/districts";
import type { InsertLanguage } from "@backend/db/types/languages";
import type { InsertPermission } from "@backend/db/types/permissions";
import type { InsertRole } from "@backend/db/types/roles";
import type { InsertRoleToPermission } from "@backend/db/types/roles-to-permissions";
import type { InsertState } from "@backend/db/types/states";
import type { InsertUser } from "@backend/db/types/users";
import chalk from "chalk";
import { and, getTableName, inArray, type SQL } from "drizzle-orm";
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
];

const permissions: (InsertPermission & { roles: string[] })[] = [
  {
    name: "total_control",
    description: "Total control over the system",
    roles: ["admin"],
  },
];

const users: InsertUser[] = [
  {
    email: "admin@admin.com",
    password: "12345678",
    roleId: 1,
    username: "admin",
  }
];

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
];

const states: { name: InsertState["name"], country: string }[] = [
  {
    name: "New York",
    country: "United States",
  },
  {
    name: "Norte de Santander",
    country: "Colombia",
  },
];

const cities: { name: InsertCity["name"], state: string }[] = [
  {
    name: "New York",
    state: "New York",
  },
  {
    name: "Cúcuta",
    state: "Norte de Santander",
  },
];

const districts: { name: InsertDistrict["name"], city: string }[] = [
  {
    name: "Brooklyn",
    city: "New York",
  },
  {
    name: "Los Patios",
    city: "Cúcuta",
  }
];

const currencies: InsertCurrency[] = [
  {
    name: "US Dollar",
    code: "USD",
    symbol: "$",
    decimalDigits: 2,
  },
  {
    name: "Colombian Peso",
    code: "COP",
    symbol: "$",
    decimalDigits: 0,
  },
];

const countryToCurrencies: { country: string, currencies: string[] }[] = [
  {
    country: "United States",
    currencies: ["USD"],
  },
  {
    country: "Colombia",
    currencies: ["COP"],
  },
];

const languages: InsertLanguage[] = [
  {
    name: "English",
    code: "en",
    nativeName: "English",
    script: "Latin",
  },
  {
    name: "Spanish",
    code: "es",
    nativeName: "Español",
    script: "Latin",
  }
];

const countryToLanguages: { country: string, languages: string[] }[] = [
  {
    country: "United States",
    languages: ["English"],
  },
  {
    country: "Colombia",
    languages: ["Spanish"],
  },
];

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

  console.log(chalk.white.bold("Seeding users..."));
  await seedList({
    table: userTable,
    data: users.map(({ password, ...e }) => ({
      password: Bun.password.hashSync(password, "bcrypt"),
      ...e,
    })),
    findWhere: inArray(userTable.email, users.map((r) => r.email)),
    filterBy: (found, value) => found.email === value.email,
    mapBy: (value) => value.email
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

  await seedList({
    table: currencyTable,
    data: currencies,
    findWhere: inArray(currencyTable.code, currencies.map((r) => r.code ?? "")),
    filterBy: (found, value) => found.code === value.code,
    mapBy: (value) => value.code
  });

  await seedList({
    table: languageTable,
    data: languages,
    findWhere: inArray(languageTable.code, languages.map((r) => r.code ?? "")),
    filterBy: (found, value) => found.code === value.code,
    mapBy: (value) => value.code
  });

  const existingLanguages = await db.select().from(languageTable);
  const countryToLanguagesToInsert: InsertCountryToLanguage[] = [];
  for (const countryToLanguage of countryToLanguages) {
    const country = existingCountries.find((r) => r.name === countryToLanguage.country);
    for (const language of countryToLanguage.languages) {
      const found = existingLanguages.find((r) => r.name === language);
      if (!found || !country) continue;
      countryToLanguagesToInsert.push({
        countryId: country.id,
        languageId: found.id,
      });
    }
  }

  await seedList({
    table: countryToLanguageTable,
    data: countryToLanguagesToInsert,
    findWhere: and(
      inArray(countryToLanguageTable.countryId, countryToLanguagesToInsert.map((r) => r.countryId)),
      inArray(countryToLanguageTable.languageId, countryToLanguagesToInsert.map((r) => r.languageId))
    ),
    filterBy: (found, value) => found.countryId === value.countryId && found.languageId === value.languageId,
    mapBy: (value) => `${value.countryId} - ${value.languageId}`
  })

  const existingCurrencies = await db.select().from(currencyTable);
  const countryToCurrenciesToInsert: InsertCountryToCurrency[] = [];
  for (const countryToCurrency of countryToCurrencies) {
    const country = existingCountries.find((r) => r.name === countryToCurrency.country);
    for (const currency of countryToCurrency.currencies) {
      const found = existingCurrencies.find((r) => r.code === currency);
      if (!found || !country) continue;
      countryToCurrenciesToInsert.push({
        countryId: country.id,
        currencyId: found.id,
      });
    }
  }

  await seedList({
    table: countryToCurrencyTable,
    data: countryToCurrenciesToInsert,
    findWhere: and(
      inArray(countryToCurrencyTable.countryId, countryToCurrenciesToInsert.map((r) => r.countryId)),
      inArray(countryToCurrencyTable.currencyId, countryToCurrenciesToInsert.map((r) => r.currencyId))
    ),
    filterBy: (found, value) => found.countryId === value.countryId && found.currencyId === value.currencyId,
    mapBy: (value) => `${value.countryId} - ${value.currencyId}`
  });

  console.log(chalk.white.bold("Seeding completed!"));

  process.exit(0);
};

init();