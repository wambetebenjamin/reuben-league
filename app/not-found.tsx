import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { WHATSAPP_REGISTER_LINK } from '@/lib/site'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="site-section">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-primary">Error 404</p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-ink">
              This page has left the pitch
            </h1>
            <p className="mt-4 text-sm sm:text-base text-body max-w-xl mx-auto">
              The page you asked for does not exist, or the league has been renamed. The live tables are still where
              you left them.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/" className="btn btn-primary w-full sm:w-auto min-h-[48px] px-6 rounded-none">
                Back to the homepage
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/leagues" className="btn btn-outline-black w-full sm:w-auto min-h-[48px] px-6 rounded-none">
                Browse leagues
              </Link>
            </div>

            <p className="mt-8 text-sm text-body">
              Need help finding a fixture?{' '}
              <a
                href={WHATSAPP_REGISTER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline"
              >
                <MessageCircle size={14} aria-hidden="true" />
                WhatsApp +254 112 272 061
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
