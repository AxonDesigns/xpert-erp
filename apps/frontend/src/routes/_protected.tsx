import ErrorBoundary from "@frontend/components/error-boundary";
import {
  Foldout,
  FoldoutContent,
  FoldoutGroup,
  FoldoutTrigger,
} from "@frontend/components/foldout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarLayout,
} from "@frontend/components/sidebar";
import { Button } from "@frontend/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@frontend/components/ui/popover";
import { Separator } from "@frontend/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@frontend/components/ui/tooltip";
import { useTheme } from "@frontend/hooks/theme";
import { useAuth } from "@frontend/hooks/use-auth";
import { useSidebar } from "@frontend/hooks/use-sidebar";
import { cn } from "@frontend/lib/utils";
import type { FileRouteTypes } from "@frontend/routeTree.gen";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { LogOut, Moon, SidebarIcon, Sun, SunMoon } from "lucide-react";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context, location }) => {
    let shouldRedirect = false;

    if (context.auth.status === "pending") {
      const response = await context.auth.ensureData();
      // @ts-ignore
      if (response.status === "error") {
        shouldRedirect = true;
      }
    }

    if (context.auth.status === "unauthenticated") {
      shouldRedirect = true;
    }

    if (shouldRedirect) {
      throw redirect({
        to: "/login",
        from: location.pathname as FileRouteTypes["to"],
        search: {
          goto: location.pathname as FileRouteTypes["to"],
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { isOpen, setIsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <SidebarLayout>
      <Sidebar>
        <SidebarHeader className="grid grid-cols-1">
          <Popover>
            <PopoverTrigger
              className="flex gap-2 items-center w-full p-2 rounded-sm h-auto"
              asChild
            >
              <Button
                className="bg-foreground/5 hover:bg-foreground/10"
                variant="none"
              >
                <picture>
                  <img
                    src="avatar.png"
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-xs"
                  />
                </picture>
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-left">Company Name</span>
                  <span className="text-left text-xs text-muted-foreground">
                    My Field
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-trigger-width">
              Hola
            </PopoverContent>
          </Popover>
        </SidebarHeader>
        <SidebarContent>
          <FoldoutGroup multiple>
            <Foldout value="general" startOpen>
              <FoldoutTrigger>General</FoldoutTrigger>
              <FoldoutContent>
                <Button variant="none" className="justify-start" asChild>
                  <Link
                    to="/"
                    className="text-foreground/50 hover:bg-foreground/5 data-[status=active]:text-foreground data-[status=active]:bg-foreground/10 hover:data-[status=active]:bg-foreground/20"
                  >
                    Home
                  </Link>
                </Button>
                <Button variant="none" className="justify-start" asChild>
                  <Link
                    to="/activity"
                    className="text-foreground/50 hover:bg-foreground/5 data-[status=active]:text-foreground data-[status=active]:bg-foreground/10 hover:data-[status=active]:bg-foreground/20"
                  >
                    Activity
                  </Link>
                </Button>
                <Button variant="none" className="justify-start" asChild>
                  <Link
                    to="/roles"
                    className="text-foreground/50 hover:bg-foreground/5 data-[status=active]:text-foreground data-[status=active]:bg-foreground/10 hover:data-[status=active]:bg-foreground/20"
                  >
                    Roles
                  </Link>
                </Button>
                <Button variant="none" className="justify-start" asChild>
                  <Link
                    to="/permissions"
                    className="text-foreground/50 hover:bg-foreground/5 data-[status=active]:text-foreground data-[status=active]:bg-foreground/10 hover:data-[status=active]:bg-foreground/20"
                  >
                    Permissions
                  </Link>
                </Button>
              </FoldoutContent>
            </Foldout>
          </FoldoutGroup>
        </SidebarContent>
        <SidebarFooter className="grid grid-cols-1">
          <Popover>
            <PopoverTrigger
              className="flex gap-2 items-center p-2 rounded-sm h-auto"
              asChild
            >
              <Button
                className="bg-foreground/5 hover:bg-foreground/10"
                variant="none"
              >
                <picture>
                  <img
                    src="avatar.png"
                    alt="Profile"
                    className="w-9 h-9 object-cover rounded-xs"
                  />
                </picture>
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-left text-sm">{user?.username}</span>
                  <span className="text-left text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col items-stretch p-0 popover-trigger-width">
              <span className="text-xs m-2 text-muted-foreground">General</span>
              <Separator orientation="horizontal" />
              <TooltipProvider>
                <div className="flex rounded-md">
                  <Tooltip defaultOpen={false}>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          "flex-1 bg-foreground/0 hover:bg-foreground/10",
                          "data-[selected=true]:bg-foreground data-[selected=true]:hover:bg-foreground/85",
                          "data-[selected=true]:text-background rounded-none",
                        )}
                        variant="none"
                        data-selected={theme === "system"}
                        onClick={() => setTheme("system")}
                      >
                        <SunMoon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>System</span>
                    </TooltipContent>
                  </Tooltip>
                  <Separator orientation="vertical" />
                  <Tooltip defaultOpen={false}>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          "flex-1 bg-foreground/0 hover:bg-foreground/10",
                          "data-[selected=true]:bg-foreground data-[selected=true]:hover:bg-foreground/85",
                          "data-[selected=true]:text-background rounded-none",
                        )}
                        variant="none"
                        data-selected={theme === "light"}
                        onClick={() => setTheme("light")}
                      >
                        <Sun />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Light</span>
                    </TooltipContent>
                  </Tooltip>
                  <Separator orientation="vertical" />
                  <Tooltip defaultOpen={false}>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          "flex-1 bg-foreground/0 hover:bg-foreground/10",
                          "data-[selected=true]:bg-foreground data-[selected=true]:hover:bg-foreground/85",
                          "data-[selected=true]:text-background rounded-none",
                        )}
                        variant="none"
                        data-selected={theme === "dark"}
                        onClick={() => setTheme("dark")}
                      >
                        <Moon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Dark</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <Separator orientation="horizontal" />
              <span className="text-xs m-2 text-muted-foreground">Account</span>
              <Separator orientation="horizontal" />
              <Button
                variant="destructiveLow"
                className="rounded-none justify-start"
                onClick={() => {
                  logout();
                }}
              >
                <LogOut />
                <span>Logout</span>
              </Button>
            </PopoverContent>
          </Popover>
        </SidebarFooter>
      </Sidebar>
      <div className="relative grid grid-cols-1 flex-1 transition-all duration-300">
        <Button
          size="icon"
          variant="ghost"
          className="absolute z-40 transition-transform !duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <SidebarIcon />
        </Button>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </SidebarLayout>
  );
}
