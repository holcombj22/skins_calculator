import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skinscalculator.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Golf Skins Pro',
  title: {
    default: 'Golf Skins Pro | Golf Skins Calculator',
    template: '%s | Golf Skins Pro',
  },
  description:
    'Golf Skins Pro is a free golf skins calculator. Enter players, scores, and the total pot to instantly see who wins each skin and how much they earn.',
  keywords: [
    'golf',
    'skins',
    'calculator',
    'golf skins calculator',
    'golf skins game',
    'skins game golf',
    'golf scorecard',
    'golf betting calculator',
    'golf pot calculator',
    'golf skin winnings',
  ],
  authors: [{ name: 'Golf Skins Pro' }],
  creator: 'Golf Skins Pro',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/apple-icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Golf Skins Pro | Golf Skins Calculator',
    description:
      'Golf Skins Pro is a free golf skins calculator. Enter players, scores, and the total pot to instantly see who wins each skin and how much they earn.',
    siteName: 'Golf Skins Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Golf Skins Pro golf skins calculator — track skins game results hole by hole',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golf Skins Pro | Golf Skins Calculator',
    description:
      'Golf Skins Pro is a free golf skins calculator. Enter players, scores, and the total pot to instantly see who wins each skin and how much they earn.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
