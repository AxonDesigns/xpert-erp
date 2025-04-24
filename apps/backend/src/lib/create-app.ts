import type { AppBindings } from "@backend/lib/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { serveStatic } from "hono/bun";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import { handler as ssrHandler } from "static/docs/server/entry.mjs";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export function createApp() {
  const app = createRouter();

  app.use(requestId()).use(serveEmojiFavicon("🗿"));

  // Serve docs
  app.use(
    "/docs/*",
    serveStatic({
      root: "static/docs/client/",
      rewriteRequestPath: (path) => path.replace("/docs", ""),
      onNotFound: (path) => {
        console.log("Not found", path);
      },
    }),
  );
  app.use("/docs/*", ssrHandler);
  app.get(
    "/favicon.svg",
    serveStatic({
      root: "static/docs/client/",
      onNotFound: (path) => {
        console.log("Not found", path);
      },
    }),
  );

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
