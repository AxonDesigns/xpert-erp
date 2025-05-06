import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/activity')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='flex justify-center items-center bg-surface-1 animate-page-in flex-1 rounded-lg'>
      <span>Activity</span>
    </main>
  )
}
