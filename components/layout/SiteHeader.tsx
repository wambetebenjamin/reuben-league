'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { SITE } from '@/lib/site'

const LINKS = [
  { href: '/leagues', label: 'Leagues' },
  { href: '/about', label: 'About' },
  { href: '/register-tournament', label: 'Register a tournament' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
          <Logo className="text-lg sm:text-xl" />

          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center min-h-[44px] px-3 text-sm font-bold transition-colors ${
                    active ? 'text-primary' : 'text-ink hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/login"
              className="inline-flex items-center min-h-[44px] px-3 text-sm font-bold text-ink hover:text-primary"
            >
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/register-tournament"
              className="btn btn-primary hidden md:inline-flex min-h-[44px] px-5 rounded-none"
            >
              Register
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] border-2 border-ink text-ink focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div
            id="mobile-navigation"
            className="absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-line">
              <Logo className="text-base" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-ink"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="flex flex-col px-5 py-4">
              {[...LINKS, { href: '/login', label: 'Admin login' }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center min-h-[48px] text-base font-bold text-ink border-b border-line"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-5 mt-2">
              <Link href="/register-tournament" className="btn btn-primary w-full min-h-[48px] rounded-none">
                Register your league
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                className="mt-3 inline-flex items-center min-h-[48px] text-sm font-bold text-primary"
              >
                WhatsApp +254 112 272 061
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
