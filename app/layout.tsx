import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { VoiceTour } from '@/components/layout/VoiceTour'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://reubenleague.co.ke'),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'Kenyan football league',
    'community tournament management',
    'live standings Kenya',
    'fixture management',
    'sports league software Kenya',
  ],
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    type: 'website',
    locale: 'en_KE',
    siteName: SITE.name,
  },
  icons: {
    icon: '/ftco-32x32.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <body>
        <Providers>
          <SmoothScroll />
          <LoadingScreen />
          {children}
          <WhatsAppButton />
          <VoiceTour />
          <CookieConsent />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
