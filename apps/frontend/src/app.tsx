import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { useAuth } from '@frontend/hooks/useAuth'

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
    return <div className='flex h-dvh items-center justify-center'>
      <h1>Loading...</h1>
    </div>;
  }

  return (
    <RouterProvider router={router} context={{
      auth,
    }} />
  )
}

export default App