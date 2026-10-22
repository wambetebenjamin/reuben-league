import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How Reuben League collects, uses and protects personal data under the Kenya Data Protection Act, 2019.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="site-section">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-ink">Privacy policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated 21 October 2026</p>

        <div className="mt-8 space-y-8 text-sm sm:text-base text-body">
          <section aria-labelledby="who-we-are">
            <h2 id="who-we-are" className="text-xl font-black text-ink">
              1. Who we are
            </h2>
            <p className="mt-2">
              Reuben League is a sports league and results management platform for Kenyan community tournaments, based
              in Nairobi, Kenya. For the purposes of the Kenya Data Protection Act, 2019 (KDPA), Reuben League is the
              data controller for the personal data described in this policy.
            </p>
            <p className="mt-2">
              Contact: hello@reubenleague.co.ke, or WhatsApp +254 112 272 061.
            </p>
          </section>

          <section aria-labelledby="what-we-collect">
            <h2 id="what-we-collect" className="text-xl font-black text-ink">
              2. Personal data we collect
            </h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>
                <strong className="text-ink">Organiser data:</strong> your name, email address, phone number,
                tournament name, sport, county and any notes you send when you register a tournament or contact us.
              </li>
              <li>
                <strong className="text-ink">League data:</strong> team names, home grounds, coach names, squad lists
                with player names, positions, jersey numbers and dates of birth, plus fixture and result records.
              </li>
              <li>
                <strong className="text-ink">Match data:</strong> goals, assists, cards, referee appointments and match
                statistics. Match data is public by design, because it is the league record.
              </li>
              <li>
                <strong className="text-ink">Account data:</strong> the email address used to sign in, a hashed
                password if you use email sign in, or your Google account identifier if you choose Google sign in.
              </li>
              <li>
                <strong className="text-ink">Technical data:</strong> a session cookie, security tokens from Google
                reCAPTCHA, and aggregated page views through Vercel Analytics. We do not build advertising profiles.
              </li>
            </ul>
          </section>

          <section aria-labelledby="why">
            <h2 id="why" className="text-xl font-black text-ink">
              3. Why we process it and our lawful basis
            </h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>To set up and run your league, publish fixtures and results, and answer your enquiries.</li>
              <li>To keep the public league record accurate for players, coaches, referees and fans.</li>
              <li>To protect the platform from spam and abuse using Google reCAPTCHA.</li>
              <li>
                Our lawful bases under section 30 of the KDPA are: performance of our agreement with you, our
                legitimate interest in operating a sports records platform, compliance with legal obligations, and your
                consent where we ask for it, for example for optional cookies.
              </li>
            </ul>
          </section>

          <section aria-labelledby="sharing">
            <h2 id="sharing" className="text-xl font-black text-ink">
              4. Who we share data with
            </h2>
            <p className="mt-2">
              We do not sell personal data. We share limited data with service providers who host and support the
              platform:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Vercel, for hosting, storage and aggregated analytics.</li>
              <li>Google, for reCAPTCHA fraud checks and optional Google sign in.</li>
              <li>Our email provider, to send registration confirmations and enquiry notifications.</li>
              <li>County associations or league organisers, only for the league you are registered in.</li>
              <li>Law enforcement or regulators, where Kenyan law requires it.</li>
            </ul>
            <p className="mt-2">
              Some providers process data outside Kenya. Where that happens we rely on appropriate safeguards,
              including contractual data protection terms, as required by section 48 of the KDPA.
            </p>
          </section>

          <section aria-labelledby="retention">
            <h2 id="retention" className="text-xl font-black text-ink">
              5. How long we keep data
            </h2>
            <p className="mt-2">
              League records, including results and standings, are kept for as long as the league exists so historical
              tables stay correct. Tournament enquiries are kept for 24 months. Account data is deleted 12 months after
              an account closes. You can ask us to delete anything that is not part of the published league record.
            </p>
          </section>

          <section aria-labelledby="rights">
            <h2 id="rights" className="text-xl font-black text-ink">
              6. Your rights
            </h2>
            <p className="mt-2">Under the KDPA you have the right to:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>be informed about how your data is used;</li>
              <li>access the personal data we hold about you;</li>
              <li>ask us to correct inaccurate data, including match records;</li>
              <li>ask us to delete data we no longer need;</li>
              <li>object to processing, or ask us to restrict it;</li>
              <li>receive your data in a portable format;</li>
              <li>withdraw consent for optional cookies at any time.</li>
            </ul>
            <p className="mt-2">
              Email hello@reubenleague.co.ke to exercise any of these rights. We respond within seven days. If you are
              not satisfied, you can complain to the Office of the Data Protection Commissioner (ODPC) in Kenya.
            </p>
          </section>

          <section aria-labelledby="children">
            <h2 id="children" className="text-xl font-black text-ink">
              7. Young players
            </h2>
            <p className="mt-2">
              Youth tournaments are welcome. Organisers must have consent from a parent or guardian before submitting a
              squad list for a player under 18, and must not send us additional data about a child beyond name, position,
              jersey number and date of birth.
            </p>
          </section>

          <section aria-labelledby="security">
            <h2 id="security" className="text-xl font-black text-ink">
              8. Security
            </h2>
            <p className="mt-2">
              Access to the admin dashboard requires an authenticated account with an admin role, checked on the server
              for every action. Data in transit is encrypted with HTTPS. We keep the number of people with admin access
              small and review it each season.
            </p>
          </section>

          <section aria-labelledby="changes">
            <h2 id="changes" className="text-xl font-black text-ink">
              9. Changes to this policy
            </h2>
            <p className="mt-2">
              We update this page when our practices change. The date at the top shows the latest version. Material
              changes are announced on the site and, for organisers, by email.
            </p>
          </section>

          <section aria-labelledby="contact">
            <h2 id="contact" className="text-xl font-black text-ink">
              10. Contact
            </h2>
            <p className="mt-2">
              Reuben League, Nairobi, Kenya. Email hello@reubenleague.co.ke or WhatsApp +254 112 272 061. Our cookie
              practices are described in the{' '}
              <Link href="/legal/cookie-policy" className="text-primary underline">
                cookie policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
