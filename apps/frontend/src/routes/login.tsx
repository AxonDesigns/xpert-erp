import { Button } from '@frontend/components/ui/button';
import { useAuth } from '@frontend/hooks/useAuth';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: '/', from: '/login' });
    }
  },
})

function RouteComponent() {
  const { login } = useAuth();
  const router = useRouter();
  return <div className='flex h-dvh items-center justify-center animate-page-in'>
    <h1>Login</h1>
    <Button
      onClick={async () => {
        await login('admin@admin.com', '12345678')
        await router.invalidate();
      }}
    >
      Login
    </Button>
  </div>
}
