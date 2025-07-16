import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthData } from "@frontend/hooks/use-auth";
import { SidebarProvider } from "@frontend/hooks/useSidebar";

type RouterContext = {
  auth: AuthData;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {

  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
}
