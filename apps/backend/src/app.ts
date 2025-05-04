import configureOpenAPI from "@backend/lib/configure-open-api";
import { createApp } from "@backend/lib/create-app";
import index from "@backend/routes/index.route";
import users from "@backend/routes/users/users.index";
import roles from "@backend/routes/roles/roles.index";
import authRoute from "@backend/routes/auth/auth.index";
import auth from "@backend/middlewares/auth";
import { cors } from "hono/cors";
import { env } from "@env/backend";

const app = createApp();
configureOpenAPI(app);

const routes = [index, users, roles, authRoute] as const;

console.log(env.TRUSTED_ORIGINS);

app.use(
  "/*",
  cors({
    origin: env.TRUSTED_ORIGINS,
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/api/*", auth);

for (const route of routes) {
  app.route("/api", route);
}

export type AppType = (typeof routes)[number];

export default app;
