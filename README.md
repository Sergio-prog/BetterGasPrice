<div align="center">
  <br />
  <img src="./public/flame-icon.svg" width="80" height="auto" alt="BetterGasPrice" />
  <br />
  <h1>BetterGasPrice</h1>
  <p>
    <strong>Multi-network gas tracker</strong>
  </p>
  <p>
    Live gas prices, priority fees, and block data across Ethereum,
    Arbitrum, Optimism, BNB Chain, Avalanche, Base, and Sonic.
  </p>
  <br />
  <p>
    <a href="#features">Features</a> •
    <a href="#supported-networks">Networks</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#configuration">Configuration</a>
  </p>
  <br />
</div>

## Features

- **Real-time gas estimates** — Low, average, and high priority fees updated every 16 seconds.
- **Multi-network support** — Switch between 8 EVM chains on the fly.
- **Priority fee breakdown** — See individual base + priority components for each tier.
- **Arc gauges** — At-a-glance visual comparison across fee levels.
- **Flame aesthetic** — Animated flame meter and floating ember particles.

## Getting Started

```bash
# clone the repo
git clone https://github.com/Sergio-prog/BetterGasPrice.git
cd BetterGasPrice

# copy environment variables
cp .env.example .env

# install dependencies
bun install

# start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

<a href="https://vercel.com/new"><img src="https://vercel.com/button" alt="Deploy with Vercel" height="36" /></a>

The app is built with [TanStack Start](https://tanstack.com/start/latest) (SSR) and deploys seamlessly to Vercel.

1. Push your repo to GitHub.
2. Import the project in the [Vercel dashboard](https://vercel.com/import).
3. Set your public environment variables (see [Configuration](#configuration)).
4. Deploy — zero-config.

## Configuration

RPC endpoints are configured through **public environment variables** (`VITE_` prefix). Set them in your `.env` file locally or in your Vercel dashboard under **Settings → Environment Variables**.

All variables are optional. Fall back to `http()` (wagmi's default public endpoint) when unset.

## Tech Stack

- **Framework** — [TanStack Start](https://tanstack.com/start/latest) (React + SSR)
- **Web3** — [Wagmi](https://wagmi.sh) / [Viem](https://viem.sh)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com)
- **Icons** — [Lucide](https://lucide.dev)
- **Build** — [Vite](https://vitejs.dev)
- **Runtime** — [Bun](https://bun.sh)

## License

[MIT](LICENSE)
