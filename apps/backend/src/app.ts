import configureOpenAPI from "@backend/lib/configure-open-api";
import { createApp } from "@backend/lib/create-app";
import index from "@backend/routes/index.route";
import users from "@backend/routes/users/users.index";
import roles from "@backend/routes/roles/roles.index";
import authRoute from "@backend/routes/auth/auth.index";
import auth from "@backend/middlewares/auth";
import { getConnInfo } from "hono/bun";
import { cors } from "hono/cors";
import { env } from "@env/backend";
import db from "./db";
import { sql } from "drizzle-orm";

const app = createApp();
configureOpenAPI(app);

const routes = [index, users, roles, authRoute] as const;

app.use(
  "/api/*",
  cors({
    origin: env.TRUSTED_ORIGINS,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use("/api/*", auth);

app.post("/test", async (c) => {
  await db.execute(sql.raw(`SET app.current_user_id = ${c.var.user?.id}`));
  return c.json({ ok: true });
});

for (const route of routes) {
  app.route("/api", route);
}

export type AppType = (typeof routes)[number];

export default app;
