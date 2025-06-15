import type { AuthContext } from "@frontend/hooks/useAuth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@frontend/lib/api";
import type { PublicUser } from "@repo/backend/types/users";
import { flushSync } from "react-dom";
import { Toaster } from "@frontend/components/ui/sonner";

type RouterContext = {
  auth: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context }) => {
    try {
      const res = await api.auth.me.$get({}, {
        init: {
          credentials: 'include',
        }
      });
      if (res.status === 200) {
        const data = await res.json();
        const user = {
          id: data.id,
          email: data.email,
          username: data.username,
          roleId: data.roleId,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        } satisfies PublicUser;
        flushSync(() => context.auth.setUser(user));
      } else {
        context.auth.setUser(null);
      }
    } catch (error) { }
  },
});

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
      <Toaster />
    </QueryClientProvider>
  );
}
