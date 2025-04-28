import { env } from "@env/backend";

console.log(Bun.password.hashSync(env.ADMIN_PASSWORD, "bcrypt"));
