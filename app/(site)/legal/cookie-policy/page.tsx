import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie policy',
  description:
    'The cookies and local storage Reuben League uses, why they exist and how to manage them under the Kenya Data Protection Act, 2019.',
}

const COOKIES = [
  {
    name: 'reuben-league-cookie-consent',
    type: 'Local storage',
    purpose: 'Stores your cookie choice so the banner does not appear on every visit.',
    duration: 'Until you clear your browser data',
    category: 'Necessary',
  },
  {
    name: 'authjs.session-token',
    type: 'Cookie',
    purpose: 'Keeps organisers signed in to the admin dashboard. Created only after login.',
    duration: '30 days from sign in',
    category: 'Necessary',
  },
  {
    name: 'authjs.callback-url',
    type: 'Cookie',
    purpose: 'Remembers where to send you after a Google or email sign in.',
    duration: 'Session',
    category: 'Necessary',
  },
  {
    name: '_GRECAPTCHA',
    type: 'Cookie',
    purpose: 'Google reCAPTCHA uses this to tell humans from automated form submissions.',
    duration: 'Up to 6 months',
    category: 'Necessary',
  },
  {
    name: '_vercel_insights',
    type: 'Cookie',
    purpose: 'Aggregated page views through Vercel Analytics. No personal profile is built.',
    duration: 'Session',
    category: 'Analytics',
  },
  {
    name: 'reuben-league-voice-tour',
    type: 'Local storage',
    purpose: 'Remembers that you have already heard the site voice tour.',
    duration: 'Until you clear your browser data',
    category: 'Functional',
  },
]

export default function CookiePolicyPage() {
  return (
    <div className="site-section">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-ink">Cookie policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated 21 October 2026</p>

        <div className="mt-8 space-y-8 text-sm sm:text-base text-body">
          <section aria-labelledby="what">
            <h2 id="what" className="text-xl font-black text-ink">
              1. What cookies are
            </h2>
            <p className="mt-2">
              Cookies are small text files stored on your device when you visit a website. We also use local storage,
              which works in a similar way but stays in your browser. Both help the site remember things between pages
              or visits.
            </p>
          </section>

          <section aria-labelledby="categories">
            <h2 id="categories" className="text-xl font-black text-ink">
              2. The categories we use
            </h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>
                <strong className="text-ink">Necessary:</strong> required for sign in, security checks and remembering
                your cookie choice. These cannot be switched off.
              </li>
              <li>
                <strong className="text-ink">Functional:</strong> remember small preferences such as whether you have
                already heard the voice tour.
              </li>
              <li>
                <strong className="text-ink">Analytics:</strong> aggregated counts of page views so organisers know which
                leagues people follow. Off unless you accept analytics.
              </li>
              <li>
                <strong className="text-ink">Marketing:</strong> none are set today. If Reuben League ever promotes a
                tournament to you, marketing cookies stay off by default and are never shared with ad networks.
              </li>
            </ul>
          </section>

          <section aria-labelledby="list">
            <h2 id="list" className="text-xl font-black text-ink">
              3. Cookies we set
            </h2>
            <div className="mt-3 overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[600px] px-4 sm:px-0">
                <table className="rl-table">
                  <caption className="sr-only">Cookie names, purpose, duration and category</caption>
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Type</th>
                      <th scope="col">Purpose</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COOKIES.map((cookie) => (
                      <tr key={cookie.name}>
                        <td className="font-bold text-ink">{cookie.name}</td>
                        <td>{cookie.type}</td>
                        <td className="whitespace-normal min-w-[220px]">{cookie.purpose}</td>
                        <td>{cookie.duration}</td>
                        <td>{cookie.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-center mt-2 opacity-60 sm:hidden">Scroll left to see full table</p>
          </section>

          <section aria-labelledby="manage">
            <h2 id="manage" className="text-xl font-black text-ink">
              4. Managing cookies
            </h2>
            <p className="mt-2">
              Use the cookie banner, or the Manage Preferences button in it, to accept or reject optional cookies. You
              can also clear cookies and local storage in your browser settings at any time. Blocking necessary cookies
              stops the admin dashboard from working, but the public league pages remain readable.
            </p>
          </section>

          <section aria-labelledby="law">
            <h2 id="law" className="text-xl font-black text-ink">
              5. Your rights and Kenyan law
            </h2>
            <p className="mt-2">
              We treat cookie identifiers as personal data under the Kenya Data Protection Act, 2019. You can object to
              non essential cookies, ask what we store and ask us to delete it. More detail is in our{' '}
              <Link href="/legal/privacy-policy" className="text-primary underline">
                privacy policy
              </Link>
              . Contact hello@reubenleague.co.ke with any question about this policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
