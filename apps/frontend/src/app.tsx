import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { useAuth } from '@frontend/hooks/useAuth'
import { Toaster } from './components/ui/sonner'
import { QueryClient } from '@tanstack/react-query'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const router = createRouter({ routeTree, context: { auth: undefined!, queryClient: undefined! } })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient();

const App = () => {
  const auth = useAuth();

  return (
    <>
      <RouterProvider router={router} context={{
        auth,
        queryClient
      }} />
      <Toaster />
    </>
  )
}

export default App;