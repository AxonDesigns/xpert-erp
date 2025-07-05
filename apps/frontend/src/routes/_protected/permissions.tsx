import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/permissions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <main className="flex flex-col bg-surface-1 animate-page-in flex-1 rounded-lg p-2 pt-8 gap-2">
    <h1 className="text-4xl font-bold ml-4">Permissions</h1>
    <h2 className="ml-4">Manage your permissions</h2>
  </main>
}
