import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ethereum Gas Tracker',
  description: 'Track Ethereum gas prices in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900`}>
          <Providers>
            {children}
          </Providers>
      </body>
    </html>
  );
}