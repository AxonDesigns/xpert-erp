import { createRouter } from "@backend/lib/create-app";
import * as handlers from "./auth.handlers";
import * as routes from "./auth.routes";

const router = createRouter()
  .openapi(routes.login, handlers.login)
  .openapi(routes.register, handlers.register)
  .openapi(routes.me, handlers.me)
  .openapi(routes.logout, handlers.logout);

export default router;
