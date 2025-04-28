import { env } from "@env/backend";
import { drizzle } from "drizzle-orm/node-postgres";
import userTable from "@backend/db/schema/users";
import roleTable from "@backend/db/schema/roles";

const db = drizzle(env.DATABASE_URL, {
  schema: {
    users: userTable,
    roles: roleTable
  },
});

export default db;