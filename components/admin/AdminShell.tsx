'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import {
  BarChart3,
  CalendarPlus,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Shield,
  Trophy,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { Logo } from '@/components/Logo'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leagues/new', label: 'Leagues', icon: PlusCircle },
  { href: '/admin/teams/add', label: 'Teams', icon: Users },
  { href: '/admin/fixtures/add', label: 'Fixtures', icon: CalendarPlus },
  { href: '/admin/results/enter', label: 'Results', icon: Trophy },
  { href: '/admin/players/add', label: 'Players', icon: UserPlus },
  { href: '/admin#referees', label: 'Referees', icon: Shield },
  { href: '/admin#reports', label: 'Reports', icon: BarChart3 },
]

interface AdminShellProps {
  children: React.ReactNode
  email?: string | null
}

export function AdminShell({ children, email }: AdminShellProps) {
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

  const nav = (
    <nav aria-label="Admin sections" className="flex flex-col gap-1 mt-6">
      {LINKS.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`inline-flex items-center gap-3 px-3 min-h-[44px] text-sm font-bold transition-colors ${
              active ? 'bg-primary text-white' : 'text-ink-soft hover:bg-surface'
            }`}
          >
            <link.icon size={16} aria-hidden="true" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen border-r border-line bg-white shrink-0">
          <div className="p-5 border-b border-line">
            <Logo className="text-base" />
            <p className="mt-1 text-[11px] uppercase tracking-widest text-muted font-bold">Admin dashboard</p>
          </div>
          <div className="px-3 flex-1">{nav}</div>
          <div className="p-4 border-t border-line">
            <p className="text-xs text-muted truncate">{email ?? 'Admin'}</p>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="mt-2 btn btn-outline-black w-full min-h-[44px] rounded-none"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-line">
            <div className="flex items-center justify-between gap-3 px-4 h-16">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Open admin menu"
                  aria-expanded={open}
                  aria-controls="admin-drawer"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] border-2 border-ink text-ink"
                >
                  <Menu size={20} aria-hidden="true" />
                </button>
                <Logo className="text-sm" />
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs font-black uppercase tracking-widest text-ink"
              >
                Sign out
              </button>
            </div>
          </header>

          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside
            id="admin-drawer"
            className="absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-line">
              <Logo className="text-sm" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close admin menu"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-ink"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="px-3 flex-1 overflow-y-auto">{nav}</div>
            <div className="p-4 border-t border-line">
              <p className="text-xs text-muted truncate">{email ?? 'Admin'}</p>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
