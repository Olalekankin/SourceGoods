import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Source Good – Commerce',
  description:
    'Browse and pre-order premium household items sourced directly from manufacturers. Get the best prices with full order transparency.',
  keywords: ['pre-order', 'household items', 'sourced goods', 'e-commerce'],
  openGraph: {
    title: 'Source Good',
    description: 'Commerce Platform for Premium Household Items',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: [
      { rel: 'icon', url: '/logo-dark.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', url: '/logo-light.svg' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
