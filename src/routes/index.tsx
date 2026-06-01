import { createFileRoute } from '@tanstack/react-router'
import GasTracker from '~/components/GasTracker'

interface HomeSearch {
  network?: number
}

export const Route = createFileRoute('/')({
  validateSearch: (input: Record<string, unknown>): HomeSearch => {
    const { network } = input
    if (network === undefined) return {}
    const num = Number(network)
    return Number.isNaN(num) ? {} : { network: num }
  },
  component: Home,
})

function Home() {
  const { network } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <GasTracker
      initialChainId={network}
      onChainChange={(chainId) => {
        navigate({ search: (prev) => ({ ...prev, network: chainId }), replace: true })
      }}
    />
  )
}
