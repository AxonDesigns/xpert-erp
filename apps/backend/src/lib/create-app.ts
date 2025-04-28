import type { AppBindings } from "@backend/lib/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export function createApp() {
  const app = createRouter();

  app.use(requestId()).use(serveEmojiFavicon("🗿"));

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
