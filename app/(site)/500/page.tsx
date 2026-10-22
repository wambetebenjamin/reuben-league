import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Something went wrong',
  description: 'Reuben League hit an unexpected error. Try again or send us a WhatsApp message.',
  robots: { index: false, follow: false },
}

export default function ServerErrorPage() {
  return (
    <div className="site-section">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] font-black uppercase tracking-widest text-primary">Error 500</p>
        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-ink">
          The scoreboard hit a snag
        </h1>
        <p className="mt-4 text-sm sm:text-base text-body max-w-xl mx-auto">
          Something broke on our side while loading this page. Your league data is safe. Try again in a moment, and if
          it keeps happening message us on WhatsApp and we will fix it.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/" className="btn btn-primary w-full sm:w-auto min-h-[48px] px-6 rounded-none">
            <RefreshCw size={16} aria-hidden="true" />
            Back to the homepage
          </Link>
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
          <Link href="/leagues" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            Or browse the leagues
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  )
}
