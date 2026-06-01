/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RPC_MAINNET?: string
  readonly VITE_RPC_SEPOLIA?: string
  readonly VITE_RPC_ARBITRUM?: string
  readonly VITE_RPC_OPTIMISM?: string
  readonly VITE_RPC_BSC?: string
  readonly VITE_RPC_AVALANCHE?: string
  readonly VITE_RPC_BASE?: string
  readonly VITE_RPC_SONIC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
