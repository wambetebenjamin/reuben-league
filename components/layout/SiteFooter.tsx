import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Twitter } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { SITE, WHATSAPP_REGISTER_LINK } from '@/lib/site'

const leagueLinks = [
  { href: '/leagues', label: 'Leagues directory' },
  { href: '/register-tournament', label: 'Register a tournament' },
  { href: '/about', label: 'How Reuben League works' },
  { href: '/login', label: 'Organiser login' },
]

const legalLinks = [
  { href: '/legal/privacy-policy', label: 'Privacy policy' },
  { href: '/legal/terms', label: 'Terms of service' },
  { href: '/legal/cookie-policy', label: 'Cookie policy' },
]

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Logo variant="light" className="text-xl" />
            <p className="mt-4 text-sm text-white/60 max-w-xs">{SITE.tagline}</p>
            <p className="mt-4 text-sm text-white/60">
              Sports league and results management for Kenyan community tournaments.
            </p>
          </div>

          <div>
            <h2 className="footer-heading text-xs font-black uppercase tracking-widest text-white mb-4">
              Platform
            </h2>
            <ul className="space-y-2">
              {leagueLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-heading text-xs font-black uppercase tracking-widest text-white mb-4">
              Legal
            </h2>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-heading text-xs font-black uppercase tracking-widest text-white mb-4">
              Talk to us
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href={WHATSAPP_REGISTER_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] text-sm text-white/60 hover:text-white transition-colors"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp +254 112 272 061
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2 min-h-[44px] text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Mail size={16} aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 min-h-[44px] text-sm text-white/60">
                  <MapPin size={16} aria-hidden="true" />
                  {SITE.county}
                </span>
              </li>
            </ul>

            <div className="flex items-center gap-2 mt-2">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reuben League on Facebook"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] border border-white/20 text-white/70 hover:text-white hover:border-white/60 transition-colors"
              >
                <Facebook size={18} aria-hidden="true" />
              </a>
              <a
                href={SITE.social.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reuben League on X"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] border border-white/20 text-white/70 hover:text-white hover:border-white/60 transition-colors"
              >
                <Twitter size={18} aria-hidden="true" />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reuben League on Instagram"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] border border-white/20 text-white/70 hover:text-white hover:border-white/60 transition-colors"
              >
                <Instagram size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Reuben League. Built for Kenyan community sport.
          </p>
          <p className="text-xs text-white/50">
            Data handled under the Kenya Data Protection Act, 2019.
          </p>
        </div>
      </div>
    </footer>
  )
}
