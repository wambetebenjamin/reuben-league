import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ClipboardList, Database, Users } from 'lucide-react'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'About Reuben League',
  description:
    'Reuben League is built in Nairobi for Kenyan community tournaments: a mission to make every match count and every table live, with a team behind it.',
}

const TEAM = [
  {
    name: 'Reuben Mutiso',
    role: 'Founder and league operations',
    image: '/images/portraits/organiser-1.jpg',
    bio: 'Ran estate leagues in Nairobi for eleven years before building the platform he wanted as an organiser.',
  },
  {
    name: 'Sarah Wanjiku',
    role: 'Tournament success',
    image: '/images/portraits/organiser-2.jpg',
    bio: 'Onboards new leagues, trains matchday staff and keeps the referee panels organised across counties.',
  },
  {
    name: 'Dennis Mutua',
    role: 'Matchday and data',
    image: '/images/portraits/organiser-3.jpg',
    bio: 'Works with clubs to keep squad lists, scorer records and fixture changes accurate through the season.',
  },
]

const ORGANISER_STEPS = [
  {
    icon: ClipboardList,
    title: 'Send us your tournament',
    body: 'Register online or on WhatsApp. We confirm dates, venues, teams and the referee panel with you.',
  },
  {
    icon: Database,
    title: 'We set up and import',
    body: 'Your league, teams, squads and first fixtures are loaded for you. You get an admin login for your organisers.',
  },
  {
    icon: Users,
    title: 'You publish live',
    body: 'Enter results from the touchline. Standings, top scorers, team form and match pages update for everyone.',
  },
]

export default function AboutPage() {
  return (
    <div>
      <section className="bg-ink text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <p className="text-xs font-black uppercase tracking-widest text-primary-soft">About Reuben League</p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight max-w-3xl">
            Every game counts. Every table is live.
          </h1>
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/75">
            Reuben League is a sports league and results management platform built in Nairobi for Kenyan community
            tournaments. We give organisers the tools that professional leagues take for granted, then publish
            everything so players, coaches and fans can follow along from a phone in the stand.
          </p>
        </div>
      </section>

      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <SectionHeading
              subheading="Our mission"
              title="Community sport deserves professional data"
              description="Talented players and tireless organisers across Kenya are let down by paper score sheets and results that never reach the people who care. We fix the record keeping so the competition can grow."
            />
            <div className="mt-6 space-y-4 text-sm sm:text-base text-body">
              <p>
                A league table is not admin. It is the story of a season. When a table is accurate, a promotion race
                becomes a conversation in every shop in the estate, a top scorer list turns a young forward into a
                local name, and a referee appointment published a week early removes an argument before kick off.
              </p>
              <p>
                Reuben League keeps that record in one place: fixtures, results, cards, squads and referees. Organisers
                keep control of what goes public, and every page is readable on a basic phone on a slow connection.
              </p>
              <p>
                We work with county associations, youth trusts and estate leagues. If you run a tournament in Kenya,
                we want your table to be live before the final whistle.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/images/community-players.jpg"
              alt="Two community footballers in red kit standing on the pitch before a match"
              width={500}
              height={750}
              className="w-full h-56 sm:h-72 object-cover object-top"
            />
            <Image
              src="/images/referee.jpg"
              alt="Referee holding up a red card during a Kenyan community match"
              width={525}
              height={350}
              className="w-full h-56 sm:h-72 object-cover"
            />
            <Image
              src="/images/netball.jpg"
              alt="Netball players contesting a shot on an outdoor court"
              width={500}
              height={333}
              className="w-full h-40 sm:h-52 object-cover"
            />
            <Image
              src="/images/basketball.jpg"
              alt="Basketball player in a red jersey holding the ball on an outdoor court"
              width={500}
              height={700}
              className="w-full h-40 sm:h-52 object-cover"
            />
          </div>
        </div>
      </section>

      <section className="site-section bg-surface-2 border-y border-line">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subheading="For organisers"
            title="How Reuben League works"
            description="Three steps from a fixture list on paper to a live league page your whole community can follow."
          />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {ORGANISER_STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08} className="h-full">
                <div className="rl-card h-full p-6">
                  <span className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary mb-4">
                    <step.icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-black text-ink">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-body">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: '7', label: 'Leagues on the platform' },
              { value: '60', label: 'Teams with live pages' },
              { value: '5', label: 'Sports covered' },
            ].map((stat) => (
              <div key={stat.label} className="border-l-4 border-primary pl-4">
                <p className="text-3xl font-black text-ink">{stat.value}</p>
                <p className="text-sm text-body">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/register-tournament"
            className="btn btn-primary mt-8 w-full sm:w-auto min-h-[48px] px-6 rounded-none"
          >
            Register your tournament
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subheading="The team"
            title="People behind the platform"
            align="center"
            description="A small Nairobi team that spends its weekends at grounds across the country."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map((person, index) => (
              <Reveal key={person.name} delay={index * 0.08} className="h-full">
                <figure className="rl-card h-full overflow-hidden">
                  <Image
                    src={person.image}
                    alt={`Portrait of ${person.name}`}
                    width={500}
                    height={500}
                    className="w-full h-64 object-cover object-top"
                  />
                  <figcaption className="p-5">
                    <p className="text-base font-black text-ink">{person.name}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mt-0.5">{person.role}</p>
                    <p className="mt-2 text-sm text-body">{person.bio}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section bg-surface-2 border-t border-line">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <SectionHeading
              subheading="Contact"
              title="Tell us about your league"
              description="Send a message and a real person replies. For anything urgent, WhatsApp is faster."
            />
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex gap-2">
                <dt className="font-bold text-ink w-24 shrink-0">Email</dt>
                <dd>
                  <a href="mailto:hello@reubenleague.co.ke" className="text-primary hover:underline">
                    hello@reubenleague.co.ke
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-ink w-24 shrink-0">WhatsApp</dt>
                <dd>
                  <a href="https://wa.me/254112272061" className="text-primary hover:underline">
                    +254 112 272 061
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-ink w-24 shrink-0">Office</dt>
                <dd className="text-body">Nairobi, Kenya. Visits by appointment.</dd>
              </div>
            </dl>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </div>
  )
}
