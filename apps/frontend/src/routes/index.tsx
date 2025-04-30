import { useEffect, useState } from 'react';
import apiClient from '@repo/api-client';
import { Button } from '@frontend/components/ui/button';
import { useTheme } from '@frontend/hooks/theme';
import { ChevronDown, Home, Moon, Stars, Sun, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@frontend/components/animated-dialog';
import { capitalize } from '@repo/utils';
import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@frontend/lib/utils';
import { Popover, PopoverTrigger } from '@frontend/components/ui/popover';
import ButtonGroup from '@frontend/components/button-group';

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
              <PopoverTrigger className='flex gap-2 items-center w-full bg-surface-2 p-2 rounded-sm'>
                <picture>
                  <img
                    src='https://picsum.photos/id/1003/200/300'
                    alt='Profile'
                    className='w-10 h-10 object-cover rounded-xs'
                  />
                </picture>
                <div className='flex-1 flex flex-col justify-center'>
                  <span className='text-left'>Username</span>
                  <span className='text-left text-xs text-muted-foreground'>email@email.com</span>
                </div>
              </PopoverTrigger>
            </Popover>
          </div>
          <div className='flex-1 flex flex-col gap-2 mx-2'>
            <Button
              onClick={() => setOpen(true)}
              layoutId='login-test'
              transition={{
                type: "tween",
                ease: [0, 1.0, 0.3, 1.0],
                duration: 0.2,
              }}
            >
              Login
            </Button>
            <ButtonGroup
              content={(
                <>
                  <Home />
                  <span>Option 1</span>
                </>
              )}
            >
              <Button variant="ghost" className='flex-1 justify-start h-auto text-xs'>
                Option 1
              </Button>
              <Button variant="ghost" className='flex-1 justify-start h-auto text-xs'>
                Option 2
              </Button>
            </ButtonGroup>
            <ButtonGroup
              content={(
                <>
                  <Home />
                  <span>Option 2</span>
                </>
              )}
            >
              <Button variant="ghost" className='flex-1 justify-start h-auto text-xs'>
                Option 1
              </Button>
              <Button variant="ghost" className='flex-1 justify-start h-auto text-xs'>
                Option 2
              </Button>
            </ButtonGroup>
          </div>
          <div className='bg-surface-2 m-2 p-2 rounded-md'>
            <div className='bg-surface-3 p-2 rounded-sm'>
              <span>Hello</span>
            </div>
          </div>

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
