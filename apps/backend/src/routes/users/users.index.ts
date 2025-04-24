import { createRouter } from "@backend/lib/create-app";
import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.updateOne, handlers.updateOne)
  .openapi(routes.deleteOne, handlers.deleteOne);

export default router;