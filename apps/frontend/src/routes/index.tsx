import { useEffect, useState } from 'react';
import apiClient from '@repo/api-client';
import { Button } from '@frontend/components/ui/button';
import { useTheme } from '@frontend/hooks/theme';
import { Activity, ChartPie, ChevronDown, Grid, Home, LayoutPanelLeft, Moon, Stars, Sun, User, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@frontend/components/animated-dialog';
import { capitalize } from '@repo/utils';
import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@frontend/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@frontend/components/ui/popover';
import { SidebarSection, SidebarSectionContent, SidebarSectionOption, SidebarSectionTrigger } from '@frontend/components/sidebar-section';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    const test = async () => {
      const client = apiClient('http://localhost:3000/api/');

      const result = await client.auth.me.$get({}, {
        init: {
          credentials: 'include'
        }
      });

      if (result.status === 200) {
        const data = await result.json();
        console.log(data);
        return;
      }


      const loginRes = await client.auth.login.$post({
        json: {
          email: 'admin@admin.com',
          password: '12345678'
        }
      }, {
        init: {
          credentials: 'include'
        }
      });
      console.log(await loginRes.json());
    }
    test();
  }, []);

  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>

      <div className='flex animate-page-in h-dvh bg-surface-0'>
        <aside className={cn(
          'm-2 flex flex-col gap-2 w-60',
          'bg-surface-1 rounded-lg shadow-md shadow-black/15',
        )}>
          <div className='m-2'>
            <Popover>
              <PopoverTrigger className='flex gap-2 items-center w-full p-2 rounded-sm h-auto' asChild>
                <Button variant="ghost">
                  <picture>
                    <img
                      src='avatar.png'
                      alt='Profile'
                      className='w-10 h-10 object-cover rounded-xs'
                    />
                  </picture>
                  <div className='flex-1 flex flex-col justify-center'>
                    <span className='text-left'>Username</span>
                    <span className='text-left text-xs text-muted-foreground'>email@email.com</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className=''>
                Hola
              </PopoverContent>
            </Popover>
          </div>
          <div className='flex-1 flex flex-col gap-2 mx-2'>
            <Button
              onClick={() => setOpen(true)}
            >
              Login
            </Button>
            <SidebarSection>
              <SidebarSectionTrigger>
                <span>Administration</span>
              </SidebarSectionTrigger>
              <SidebarSectionContent>
                <SidebarSectionOption selected>
                  <LayoutPanelLeft />
                  <span>Dashboard</span>
                </SidebarSectionOption>
                <SidebarSectionOption >
                  <Activity />
                  <span>Activity</span>
                </SidebarSectionOption>
              </SidebarSectionContent>
            </SidebarSection>
            <SidebarSection>
              <SidebarSectionTrigger>
                <h1>Inventory</h1>
              </SidebarSectionTrigger>
              <SidebarSectionContent>
                <SidebarSectionOption>
                  <ChartPie />
                  <span>Stock</span>
                </SidebarSectionOption>
                <SidebarSectionOption >
                  <Home />
                  <span>Products</span>
                </SidebarSectionOption>
              </SidebarSectionContent>
            </SidebarSection>
            <SidebarSection>
              <SidebarSectionTrigger>
                <h1>Human Resources</h1>
              </SidebarSectionTrigger>
              <SidebarSectionContent>
                <SidebarSectionOption>
                  <Users />
                  <span>Personnel</span>
                </SidebarSectionOption>
                <SidebarSectionOption >
                  <Home />
                  <span>Option 2</span>
                </SidebarSectionOption>
              </SidebarSectionContent>
            </SidebarSection>
          </div>
          <Popover>
            <PopoverTrigger className='flex gap-2 items-center p-2 rounded-sm h-auto m-2' asChild>
              <Button className='bg-surface-2 hover:bg-surface-3 text-foreground'>
                <picture>
                  <img
                    src='avatar.png'
                    alt='Profile'
                    className='w-9 h-9 object-cover rounded-xs'
                  />
                </picture>
                <div className='flex-1 flex flex-col justify-center'>
                  <span className='text-left text-sm'>Username</span>
                  <span className='text-left text-xs text-muted-foreground'>email@email.com</span>
                </div>
              </Button>

            </PopoverTrigger>
            <PopoverContent className='popover-trigger-width'>

            </PopoverContent>
          </Popover>

        </aside>
        <main className='flex-1'>

        </main>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            layoutId='login-test'
            transition={{
              type: "tween",
              ease: [0, 1.0, 0.3, 1.0],
              duration: 0.4,
            }}
          >
            <DialogTitle>{capitalize(theme)}</DialogTitle>
            <DialogDescription>Login to your account</DialogDescription>
            <div className='flex gap-2'>
              <Button onClick={() => setTheme('system')}>
                <Stars />
              </Button>
              <Button onClick={() => setTheme('light')}>
                <Sun />
              </Button>
              <Button onClick={() => setTheme('dark')}>
                <Moon />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </>
  )
}
