import { createFileRoute } from '@tanstack/react-router'
import GasTracker from '~/components/GasTracker'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <GasTracker />
}
