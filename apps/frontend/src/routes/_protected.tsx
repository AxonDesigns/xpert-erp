import ErrorBoundary from "@frontend/components/error-boundary";
import {
  Section,
  SectionContent,
  SectionOption,
  SectionTrigger,
} from "@frontend/components/sidebar-section";
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
import { useAuth } from "@frontend/hooks/useAuth";
import { cn } from "@frontend/lib/utils";
import type { FileRouteTypes } from "@frontend/routeTree.gen";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import {
  Activity,
  ChartPie,
  Home,
  LayoutPanelLeft,
  LogOut,
  Moon,
  ShieldHalf,
  ShieldUser,
  Sidebar,
  Sun,
  SunMoon,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/login",
        from: location.pathname as FileRouteTypes["to"],
        search: {
          goto: location.pathname as FileRouteTypes["to"],
        }
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is a workaround for the router invalidation
  useEffect(() => {
    router.invalidate();
  }, [user]);

  return (
    <div className="flex p-2 gap-2 h-dvh overflow-hidden">
      <aside
        data-state={isOpen}
        className={cn(
          "absolute flex flex-col gap-2 w-[240px] top-2 bottom-2 data-[state=false]:-translate-x-[calc(240px+0.5rem)]",
          "bg-surface-1 rounded-lg",
          "shadow-md shadow-black/15",
          "not-dark:bg-surface-3",
          "transition-transform duration-300",
        )}
      >
        <div className="m-2">
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
        </div>
        <div className="flex-1 flex flex-col gap-2 mx-2 overflow-y-auto overflow-x-visible">
          <Section>
            <SectionTrigger>
              <span>Administration</span>
            </SectionTrigger>
            <SectionContent>
              <SectionOption asChild>
                <Link to="/">
                  <LayoutPanelLeft />
                  <span>Dashboard</span>
                </Link>
              </SectionOption>
              <SectionOption asChild>
                <Link to="/activity">
                  <Activity />
                  <span>Activity</span>
                </Link>
              </SectionOption>
              <SectionOption asChild>
                <Link to="/roles">
                  <ShieldUser />
                  <span>Roles</span>
                </Link>
              </SectionOption>
              <SectionOption asChild>
                <Link to="/permissions">
                  <ShieldHalf />
                  <span>Permissions</span>
                </Link>
              </SectionOption>
            </SectionContent>
          </Section>
          <Section>
            <SectionTrigger>
              <h1>Inventory</h1>
            </SectionTrigger>
            <SectionContent>
              <SectionOption>
                <ChartPie />
                <span>Stock</span>
              </SectionOption>
              <SectionOption>
                <Home />
                <span>Products</span>
              </SectionOption>
            </SectionContent>
          </Section>
          <Section>
            <SectionTrigger>
              <h1>Human Resources</h1>
            </SectionTrigger>
            <SectionContent>
              <SectionOption>
                <Users />
                <span>Personnel</span>
              </SectionOption>
              <SectionOption>
                <Home />
                <span>Option 2</span>
              </SectionOption>
            </SectionContent>
          </Section>
        </div>
        <Popover>
          <PopoverTrigger
            className="flex gap-2 items-center p-2 rounded-sm h-auto m-2"
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
                <Tooltip>
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
                <Tooltip>
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
                <Tooltip>
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
              variant="ghost"
              className="rounded-none justify-start"
              onClick={async () => {
                await logout();
                router.invalidate();
              }}
            >
              <LogOut />
              <span>Logout</span>
            </Button>
          </PopoverContent>
        </Popover>
      </aside>
      <Button
        size="icon"
        variant="ghost"
        data-state={isOpen}
        className="absolute z-50 data-[state=true]:translate-x-[250px] transition-transform !duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sidebar />
      </Button>
      <div
        data-state={isOpen}
        className="grid grid-cols-1 flex-1 data-[state=true]:ml-[250px] transition-all duration-300"
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}
