import { Scalar } from "@scalar/hono-api-reference";

import packageJSON from "../../package.json" with { type: "json" };
import type { AppOpenAPI } from "@backend/lib/types";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Xpert ERP API",
    },
  });

  app.get(
    "/reference",
    Scalar({
      url: "/doc",
      theme: "none",
      darkMode: true,
      title: "Xpert ERP API Reference",
      pageTitle: "Xpert ERP API Reference",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
    }),
  );
}