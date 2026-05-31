import { http, createConfig } from 'wagmi'
import { arbitrum, avalanche, base, bsc, mainnet, optimism, sepolia, sonic } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, optimism, bsc, avalanche, base, sonic],
  transports: {
    [mainnet.id]: http('https://eth.drpc.org'),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [bsc.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http(),
    [sonic.id]: http(),
  }
})
