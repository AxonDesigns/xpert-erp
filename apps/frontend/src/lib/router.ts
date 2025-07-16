import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@frontend/routeTree.gen";
import queryClient from "./query-client";
import type { AuthData } from "@frontend/hooks/use-auth";

const router = createRouter({
  routeTree,
  context: { auth: null as unknown as AuthData, queryClient },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
