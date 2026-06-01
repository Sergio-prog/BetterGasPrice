import { http, createConfig } from 'wagmi'
import { arbitrum, avalanche, base, bsc, mainnet, optimism, sepolia, sonic } from 'wagmi/chains'

// Default RPC endpoints — used when no env var is set
const defaultRpcs: Record<number, string | undefined> = {
  [mainnet.id]: 'https://eth.drpc.org',
  [sepolia.id]: undefined,
  [arbitrum.id]: undefined,
  [optimism.id]: undefined,
  [bsc.id]: undefined,
  [avalanche.id]: undefined,
  [base.id]: undefined,
  [sonic.id]: undefined,
}

// Map chain IDs to their public VITE_ env variables (configurable in Vercel dashboard)
const rpcEnvMap: Record<number, string | undefined> = {
  [mainnet.id]: import.meta.env.VITE_RPC_MAINNET,
  [sepolia.id]: import.meta.env.VITE_RPC_SEPOLIA,
  [arbitrum.id]: import.meta.env.VITE_RPC_ARBITRUM,
  [optimism.id]: import.meta.env.VITE_RPC_OPTIMISM,
  [bsc.id]: import.meta.env.VITE_RPC_BSC,
  [avalanche.id]: import.meta.env.VITE_RPC_AVALANCHE,
  [base.id]: import.meta.env.VITE_RPC_BASE,
  [sonic.id]: import.meta.env.VITE_RPC_SONIC,
}

function resolveTransport(chainId: number) {
  const rpcUrl = rpcEnvMap[chainId] || defaultRpcs[chainId]
  return rpcUrl ? http(rpcUrl) : http()
}

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, optimism, bsc, avalanche, base, sonic],
  transports: {
    [mainnet.id]: resolveTransport(mainnet.id),
    [sepolia.id]: resolveTransport(sepolia.id),
    [arbitrum.id]: resolveTransport(arbitrum.id),
    [optimism.id]: resolveTransport(optimism.id),
    [bsc.id]: resolveTransport(bsc.id),
    [avalanche.id]: resolveTransport(avalanche.id),
    [base.id]: resolveTransport(base.id),
    [sonic.id]: resolveTransport(sonic.id),
  },
})
