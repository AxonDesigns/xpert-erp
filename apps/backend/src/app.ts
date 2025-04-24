import configureOpenAPI from "@backend/lib/configure-open-api";
import { createApp } from "@backend/lib/create-app";
import index from "@backend/routes/index.route";
import users from "@backend/routes/users/users.index";

const app = createApp();
configureOpenAPI(app);

const routes = [
  index,
  users,
] as const;

for (const route of routes) {
  app.route("/", route);
}

export type AppType = typeof routes[number];

export default app;