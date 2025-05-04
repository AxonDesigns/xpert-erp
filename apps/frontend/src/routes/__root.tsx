import { Button } from '@frontend/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@frontend/components/ui/dialog';
import { useTheme } from '@frontend/hooks/theme';
import type { AuthContext } from '@frontend/hooks/useAuth'
import { capitalize } from '@repo/utils';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Moon, Stars, Sun } from 'lucide-react';
import { useState } from 'react';

type RouterContext = {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          hola
        </DialogTrigger>
        <DialogContent>
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
    </>
  )
}
