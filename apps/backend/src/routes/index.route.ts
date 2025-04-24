import { createRouter } from "@backend/lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const router = createRouter()
  .openapi(
    createRoute({
      tags: ['index'],
      path: '/',
      method: 'get',
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema("Xpert ERP API"), "Xpert ERP API"),
      }
    },
    ),
    (c) => c.json({
      message: "Xpert ERP API",
    }, HttpStatusCodes.OK)
  );

export default router;