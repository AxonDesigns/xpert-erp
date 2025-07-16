import { RouterProvider } from '@tanstack/react-router'
import { useAuth } from '@frontend/hooks/use-auth'
import { Toaster } from './components/ui/sonner'
import router from '@frontend/lib/router';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/query-client';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProviderWithContext />
      <Toaster />
    </QueryClientProvider>
  )
}

function RouterProviderWithContext() {
  const auth = useAuth();

  return (
    <RouterProvider router={router} context={{
      auth,
    }} />
  )
}

export default App;