import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { useAuth } from '@frontend/hooks/useAuth'
import { Toaster } from './components/ui/sonner'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const router = createRouter({ routeTree, context: { auth: undefined! } })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


const App = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return null;
  }

  return (
    <>
      <RouterProvider router={router} context={{
        auth,
      }} />
      <Toaster />
    </>
  )
}

export default App;