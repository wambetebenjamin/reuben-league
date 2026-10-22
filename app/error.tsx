'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { MessageCircle, RefreshCw } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[reuben-league] page error', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="site-section">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-primary">Error 500</p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-ink">The scoreboard hit a snag</h1>
            <p className="mt-4 text-sm sm:text-base text-body max-w-xl mx-auto">
              Something broke while loading this page. Your league data is safe. Try again, or message us on WhatsApp
              at +254 112 272 061 and we will fix it.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                type="button"
                onClick={reset}
                className="btn btn-primary w-full sm:w-auto min-h-[48px] px-6 rounded-none"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Try again
              </button>
              <a
                href="https://wa.me/254112272061?text=Hi%20Reuben%20League%2C%20I%20hit%20an%20error%20on%20the%20site"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-black w-full sm:w-auto min-h-[48px] px-6 rounded-none"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp +254 112 272 061
              </a>
            </div>
            <p className="mt-8 text-sm text-body">
              <Link href="/" className="text-primary font-bold hover:underline">
                Back to the homepage
              </Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
