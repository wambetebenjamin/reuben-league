import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of service',
  description:
    'Terms for tournament organisers, teams, players and fans using Reuben League to publish fixtures, standings and results.',
}

export default function TermsPage() {
  return (
    <div className="site-section">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-ink">Terms of service</h1>
        <p className="mt-2 text-sm text-muted">Last updated 21 October 2026</p>

        <div className="mt-8 space-y-8 text-sm sm:text-base text-body">
          <section aria-labelledby="agreement">
            <h2 id="agreement" className="text-xl font-black text-ink">
              1. Agreement
            </h2>
            <p className="mt-2">
              These terms govern the use of Reuben League, a sports league and results management platform for Kenyan
              community tournaments. By registering a tournament, using an admin account or following a league, you
              accept these terms. If you are registering on behalf of a club or association, you confirm you have
              authority to do so.
            </p>
          </section>

          <section aria-labelledby="accounts">
            <h2 id="accounts" className="text-xl font-black text-ink">
              2. Accounts and access
            </h2>
            <p className="mt-2">
              Admin accounts are issued to league organisers and Reuben League staff. Keep your password private, use a
              Google account with two factor authentication where you can, and tell us immediately if you think someone
              else has access. We may suspend an account that is used to publish false results or that is shared outside
              your organisation.
            </p>
          </section>

          <section aria-labelledby="organisers">
            <h2 id="organisers" className="text-xl font-black text-ink">
              3. Organiser responsibilities
            </h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Publish accurate league details: sport, county, season dates, venues and team count.</li>
              <li>Enter results promptly and correct mistakes within the league rules you publish to your clubs.</li>
              <li>
                Obtain permission from teams, players and referees before publishing their names, squad numbers and
                match data, and obtain parental consent for any player under 18.
              </li>
              <li>Keep logins to yourself and only give admin access to people who need it.</li>
              <li>Comply with the Kenya Data Protection Act, 2019, and with county or national sports regulations.</li>
            </ul>
            <p className="mt-2">
              Match records are public. Once a result is published it forms part of the league record, and a correction
              requires an organiser to update the fixture so everyone sees the change.
            </p>
          </section>

          <section aria-labelledby="fees">
            <h2 id="fees" className="text-xl font-black text-ink">
              4. Fees
            </h2>
            <p className="mt-2">
              Registration and publishing are free for community tournaments during the 2026 season. If we introduce a
              paid plan, we will tell organisers in writing at least 30 days before it applies, and existing leagues
              can finish their season on the current terms.
            </p>
          </section>

          <section aria-labelledby="acceptable-use">
            <h2 id="acceptable-use" className="text-xl font-black text-ink">
              5. Acceptable use
            </h2>
            <p className="mt-2">Do not use Reuben League to:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>publish false results, fake squads or invented statistics;</li>
              <li>harass, abuse or defame players, officials, teams or fans;</li>
              <li>upload malware, attempt to break authentication, or scrape the platform at scale;</li>
              <li>publish a player&apos;s personal contact details or other data you do not have permission to share;</li>
              <li>infringe copyright, including club crests and league logos you do not own.</li>
            </ul>
          </section>

          <section aria-labelledby="ip">
            <h2 id="ip" className="text-xl font-black text-ink">
              6. Intellectual property
            </h2>
            <p className="mt-2">
              The Reuben League name, design and software belong to Reuben League. Your league content, including team
              names and descriptions, remains yours. By publishing it, you give us permission to display it on the site
              and in match reports, and to keep it in historical tables.
            </p>
          </section>

          <section aria-labelledby="availability">
            <h2 id="availability" className="text-xl font-black text-ink">
              7. Availability and changes
            </h2>
            <p className="mt-2">
              We work to keep the platform online, but we do not guarantee uninterrupted access. We may change features,
              and we may suspend an account or league that breaks these terms. Scheduled maintenance is announced on
              the site where possible.
            </p>
          </section>

          <section aria-labelledby="liability">
            <h2 id="liability" className="text-xl font-black text-ink">
              8. Liability
            </h2>
            <p className="mt-2">
              Reuben League is a records and publishing platform. We are not the organiser of your tournament, we do not
              control matches, and we are not responsible for refereeing decisions, injuries or disputes between clubs.
              Nothing in these terms limits liability that cannot be limited under Kenyan law.
            </p>
          </section>

          <section aria-labelledby="termination">
            <h2 id="termination" className="text-xl font-black text-ink">
              9. Ending use
            </h2>
            <p className="mt-2">
              You can stop using the platform at any time by asking us to close your league and admin account. We keep
              historical tables unless you ask for them to be removed, subject to the retention rules in our{' '}
              <Link href="/legal/privacy-policy" className="text-primary underline">
                privacy policy
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="law">
            <h2 id="law" className="text-xl font-black text-ink">
              10. Governing law and contact
            </h2>
            <p className="mt-2">
              These terms are governed by the laws of Kenya, and disputes are handled by the Kenyan courts. Questions:
              hello@reubenleague.co.ke or WhatsApp +254 112 272 061.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
