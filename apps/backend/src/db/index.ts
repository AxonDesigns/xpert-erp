import { env } from "@env/backend";
import { drizzle } from "drizzle-orm/node-postgres";
import users from "@backend/db/schema/users";
import roles from "@backend/db/schema/roles";

const db = drizzle(env.DATABASE_URL, {
  schema: {
    users,
    roles
  },
});

export default db;