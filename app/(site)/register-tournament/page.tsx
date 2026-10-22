import type { Metadata } from 'next'
import { CalendarCheck, MessageCircle, ShieldCheck } from 'lucide-react'
import { TournamentForm } from '@/components/forms/TournamentForm'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WHATSAPP_REGISTER_LINK } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Register your tournament',
  description:
    'Register a Kenyan community football, basketball, volleyball, rugby sevens or netball tournament on Reuben League. We set up your league, fixtures and live tables.',
}

const STEPS = [
  {
    icon: CalendarCheck,
    title: 'We call you within one working day',
    body: 'Our tournament desk confirms your season dates, venues and number of matchdays.',
  },
  {
    icon: ShieldCheck,
    title: 'Your league is set up for you',
    body: 'We import teams, coaches and referees, then publish your first round of fixtures.',
  },
  {
    icon: MessageCircle,
    title: 'You run it from your phone',
    body: 'Enter results at the pitch and the table, top scorers and team pages update instantly.',
  },
]

export default function RegisterTournamentPage() {
  return (
    <div className="site-section">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          subheading="Tournament registration"
          title="Register your tournament on Reuben League"
          description="Tell us about your competition and we will set up a managed league page with live standings, fixtures, results and top scorers. Registration is free for community tournaments during the 2026 season."
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <TournamentForm />
          </div>

          <aside className="order-1 lg:order-2 space-y-4">
            <div className="schedule-wrap">
              <strong className="block text-sm uppercase tracking-widest">Need it faster?</strong>
              <p className="text-sm text-white/90 mt-1">
                Send the tournament name on WhatsApp and we will start the setup today.
              </p>
              <a
                href={WHATSAPP_REGISTER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 bg-accent text-white text-xs font-black uppercase tracking-widest px-5 min-h-[48px] w-full"
              >
                WhatsApp +254 112 272 061
              </a>
            </div>

            <div className="rl-card p-5">
              <h2 className="text-base font-black text-ink">What happens next</h2>
              <ul className="mt-4 space-y-4">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary shrink-0">
                      <step.icon size={16} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">
                        {index + 1}. {step.title}
                      </span>
                      <span className="block text-xs text-body mt-0.5">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rl-card p-5">
              <h2 className="text-base font-black text-ink">What we need from you</h2>
              <ul className="mt-3 space-y-2 text-sm text-body list-disc list-inside">
                <li>Team list with home grounds</li>
                <li>Season start and end dates</li>
                <li>Squad lists or registration forms</li>
                <li>Referee panel, if you already have one</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
