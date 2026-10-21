import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from '@/components/forms/LoginForm'

export const metadata: Metadata = {
  title: 'Organiser login',
  description: 'Sign in to the Reuben League admin dashboard to manage leagues, fixtures, results and squads.',
}

export default function LoginPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

  return (
    <div className="site-section">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 min-h-[44px] text-xs font-black uppercase tracking-widest text-muted hover:text-primary"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to the site
        </Link>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <LoginForm googleEnabled={googleEnabled} />

          <div className="bg-ink text-white p-6 sm:p-8">
            <h2 className="text-xl font-black">What you can do in the dashboard</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li>Create a league with its season dates, county and team count.</li>
              <li>Add teams, squads, referees and fixtures in a few taps.</li>
              <li>Enter a result and watch every table and scorer list update.</li>
              <li>Export reports for sponsors and county associations.</li>
            </ul>
            <p className="mt-6 text-xs text-white/50">
              Sessions are protected with NextAuth and a server side role check on every admin action.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
