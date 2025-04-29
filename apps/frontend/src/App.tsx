import { useEffect, useState } from 'react';
import apiClient from '@repo/api-client';
import { Button } from '@frontend/components/ui/button';
import { useTheme } from './hooks/theme';
import { Moon, Stars, Sun } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './components/animated-dialog';
import { capitalize } from '@repo/utils';

function App() {
  useEffect(() => {
    const test = async () => {
      const client = apiClient('http://localhost:3000/api/');
      const result = await client.auth.me.$get({}, {
        init: {
          credentials: 'include'
        }
      });
      const data = await result.json();
      if (result.status === 200) {
        console.log(data);
      } else {
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
    }
    test();
  }, []);

  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
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
      <div className='flex flex-col items-start justify-center h-dvh'>
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

      </div>
    </>
  )
}

export default App
