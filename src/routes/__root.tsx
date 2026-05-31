import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'
import appCss from '~/styles/app.css?url'
import { Providers } from '~/components/Providers'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ethereum Gas Tracker' },
      { name: 'description', content: 'Track Ethereum gas prices in real-time' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Sora:wght@300;400;500;600&display=swap' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        <Providers>
          {children}
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
