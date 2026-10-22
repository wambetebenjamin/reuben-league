import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BarChart3, CalendarClock, ShieldCheck, Trophy } from 'lucide-react'
import { HeroHeading } from '@/components/home/HeroHeading'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StandingsTable } from '@/components/ui/StandingsTable'
import { ResultCard } from '@/components/ui/ResultCard'
import { FixtureCard } from '@/components/ui/FixtureCard'
import { TopScorersStrip } from '@/components/ui/TopScorersStrip'
import { Reveal } from '@/components/ui/Reveal'
import { getHomeData } from '@/lib/queries'
import { formatShortDate, formatTime } from '@/lib/format'
import { WHATSAPP_REGISTER_LINK } from '@/lib/site'

export const revalidate = 0

const FEATURES = [
  {
    icon: CalendarClock,
    title: 'Fixtures that stay in sync',
    body: 'Publish a full round of fixtures and every organiser, referee and fan sees the same kick off time on the same screen.',
  },
  {
    icon: BarChart3,
    title: 'Tables that update themselves',
    body: 'Enter a result once and standings, goal difference, top scorers and team form recalculate across the whole site.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for county organisers',
    body: 'Role protected dashboards, entry validation and a paper free audit trail for every fixture and result you publish.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Wanjiku',
    role: 'Organiser, Kawangware Youth Cup',
    image: '/images/portraits/organiser-2.jpg',
    quote:
      'We used to post results in three different WhatsApp groups. Now parents open the table before we have left the pitch. Registration week alone saved me two full days.',
  },
  {
    name: 'Peter Ochieng',
    role: 'Chairperson, Kisumu Lakeside Volleyball Cup',
    image: '/images/portraits/organiser-1.jpg',
    quote:
      'The referees tab ended every argument about who was on which court. I can hand a fixture list to eight clubs and nobody calls me to ask for a correction.',
  },
  {
    name: 'Dennis Mutua',
    role: 'Coordinator, Mombasa Coast Basketball Series',
    image: '/images/portraits/organiser-3.jpg',
    quote:
      'Entering a score takes under a minute on my phone at courtside. By the time the teams shake hands the standings have already moved.',
  },
]

export default async function HomePage() {
  const data = await getHomeData()
  const teamMap = new Map(data.teams.map((team) => [team.slug, team]))
  const league = data.activeLeague
  const nextRound = data.upcomingFixtures[0]?.round ?? 1

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-widest text-white bg-primary px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-dot" aria-hidden="true" />
                Matchday live across {data.leagues.filter((entry) => entry.status === 'Active').length} leagues
              </p>

              <HeroHeading />

              <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/70 max-w-xl">
                Real time fixtures, live standings and results for Kenyan community sports. Football, basketball,
                volleyball, rugby sevens and netball, all managed from one dashboard and published the moment the
                whistle goes.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/register-tournament"
                  className="btn btn-primary w-full sm:w-auto min-h-[48px] px-6 rounded-none"
                >
                  Register your tournament
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/leagues"
                  className="btn btn-outline-white w-full sm:w-auto min-h-[48px] px-6 rounded-none"
                >
                  Browse leagues
                </Link>
              </div>

              <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: 'Active leagues', value: data.leagues.filter((entry) => entry.status === 'Active').length },
                  { label: 'Teams on the platform', value: data.totalTeams },
                  { label: 'Fixtures published', value: data.totalFixtures },
                  { label: 'Counties covered', value: new Set(data.leagues.map((entry) => entry.county)).size },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50 font-bold">
                      {stat.label}
                    </dt>
                    <dd className="text-xl sm:text-2xl font-black text-white">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <Image
                src="/images/hero-team.jpg"
                alt="Community football team huddled together before a match in Kenya"
                width={500}
                height={625}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-72 sm:h-96 lg:h-[500px] object-cover object-center"
              />
              <div className="absolute bottom-0 left-0 bg-primary px-4 py-3 max-w-[85%]">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Season 2026</p>
                <p className="text-sm font-bold text-white">
                  {league.county} County, {league.sport.toLowerCase()} on matchday {nextRound}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Red matchday strip, template .schedule-wrap */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mt-0 sm:-mt-16">
        <div className="schedule-wrap max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <strong className="block text-sm uppercase tracking-widest">This matchday</strong>
              <p className="text-sm text-white/90">
                {league.name}: round {nextRound} fixtures, live table and referee appointments.
              </p>
              {data.liveFixtures[0] ? (
                <p className="mt-1 text-xs text-white/80">
                  Live now: {teamMap.get(data.liveFixtures[0].homeSlug)?.name} {data.liveFixtures[0].homeScore}-
                  {data.liveFixtures[0].awayScore} {teamMap.get(data.liveFixtures[0].awaySlug)?.name}
                </p>
              ) : null}
            </div>
            <Link
              href={`/league/${league.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-accent text-white text-xs font-black uppercase tracking-widest px-5 min-h-[48px] w-full sm:w-auto"
            >
              Open the table
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features, template feature blocks */}
      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subheading="Live match data"
            title="Run the league from the touchline"
            description="Reuben League keeps organisers, players, coaches and fans looking at the same numbers. Nothing is retyped the next morning."
          />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.08} className="h-full">
                <div className="rl-feature h-full text-left">
                  <span className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary mb-4">
                    <feature.icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm text-body">{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live standings preview */}
      <section className="site-section bg-surface-2 border-y border-line">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <SectionHeading
              subheading={league.sport}
              title="Live standings preview"
              description={`${league.name}, ${league.county} County. Top five after ${data.standingsTop[0]?.played ?? 0} rounds.`}
            />
            <Link
              href={`/league/${league.slug}`}
              className="btn btn-outline-black w-full sm:w-auto min-h-[44px] px-5 rounded-none"
            >
              Full table
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 rl-card p-4 sm:p-6">
            <StandingsTable rows={data.standingsTop} showGoalColumns={false} showHint />
          </div>
        </div>
      </section>

      {/* Latest results */}
      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subheading="Latest results"
            title="Full time scores"
            description="Four most recent results across the league, with scorers and cards on every match page."
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.latestResults.map((fixture, index) => (
              <ResultCard
                key={fixture.id}
                fixture={fixture}
                home={teamMap.get(fixture.homeSlug)}
                away={teamMap.get(fixture.awaySlug)}
                index={index}
              />
            ))}
          </div>
          <Link
            href={`/league/${league.slug}?tab=results`}
            className="mt-6 inline-flex items-center gap-2 min-h-[44px] text-xs font-black uppercase tracking-widest text-ink hover:text-primary"
          >
            All results
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Upcoming fixtures */}
      <section className="site-section bg-surface-2 border-y border-line">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subheading="Upcoming fixtures"
            title="Next on the calendar"
            description={`${league.name} round ${nextRound}. Venues and referees confirmed.`}
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.upcomingFixtures.map((fixture) => (
              <FixtureCard
                key={fixture.id}
                fixture={fixture}
                home={teamMap.get(fixture.homeSlug)}
                away={teamMap.get(fixture.awaySlug)}
              />
            ))}
          </div>
          {data.upcomingFixtures[0] ? (
            <p className="mt-4 text-xs text-muted">
              Next kick off {formatShortDate(data.upcomingFixtures[0].kickoff)} at{' '}
              {formatTime(data.upcomingFixtures[0].time)}, {data.upcomingFixtures[0].venue}.
            </p>
          ) : null}
        </div>
      </section>

      {/* Top scorers */}
      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <SectionHeading
              subheading="Top scorers"
              title="The golden boot race"
              description={`Leading goalscorers in the ${league.name}.`}
            />
            <Link
              href={`/league/${league.slug}?tab=scorers`}
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-black uppercase tracking-widest text-ink hover:text-primary"
            >
              Full scorer list
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6">
            <TopScorersStrip scorers={data.topScorers} />
          </div>
        </div>
      </section>

      {/* CTA band, template .bgimg */}
      <section className="bgimg" style={{ backgroundImage: "url('/images/stadium-night.jpg')" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-white/70">Registration is open</span>
            <h2 className="mt-2">Register your tournament on Reuben League</h2>
            <p className="mt-4 text-sm sm:text-base text-white/80">
              Send us your tournament name and we will set up your league, import your teams and publish your first
              round of fixtures. No spreadsheets, no WhatsApp score sheets.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/register-tournament"
                className="btn btn-white w-full sm:w-auto min-h-[48px] px-6 rounded-none"
              >
                Register your tournament
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href={WHATSAPP_REGISTER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-white w-full sm:w-auto min-h-[48px] px-6 rounded-none"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subheading="From the organisers"
            title="Tournaments already running on Reuben League"
            description="Three organisers on what changed after they moved their league online."
            align="center"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.1} className="h-full">
                <figure className="rl-card h-full p-6 flex flex-col">
                  <Trophy size={20} className="text-primary" aria-hidden="true" />
                  <blockquote className="mt-4 text-sm sm:text-base text-ink-soft flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Image
                      src={testimonial.image}
                      alt={`Portrait of ${testimonial.name}`}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-cover"
                    />
                    <span>
                      <span className="block text-sm font-black text-ink">{testimonial.name}</span>
                      <span className="block text-xs text-muted">{testimonial.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
