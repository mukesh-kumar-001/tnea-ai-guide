import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/colleges/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/colleges/"!</div>
}
