import { getSeedData } from './data'
import type { Enquiry, Fixture, League, Player, Referee, Team, TournamentRegistration } from './types'

/**
 * Thin data layer for Reuben League.
 *
 * Seed content ships with the app. Anything an organiser creates through the
 * admin dashboard is appended to Vercel KV when KV_REST_API_URL and
 * KV_REST_API_TOKEN are configured, and falls back to a process level memory
 * store for local development so the dashboard stays usable without cloud
 * credentials.
 */

const KEYS = {
  leagues: 'reuben-league:leagues',
  teams: 'reuben-league:teams',
  players: 'reuben-league:players',
  fixtures: 'reuben-league:fixtures',
  tournaments: 'reuben-league:tournaments',
  enquiries: 'reuben-league:enquiries',
} as const

type Bucket = keyof typeof KEYS

interface MemoryStore {
  leagues: League[]
  teams: Team[]
  players: Player[]
  fixtures: Fixture[]
  tournaments: TournamentRegistration[]
  enquiries: Enquiry[]
  results: Record<string, Fixture>
}

const globalForStore = globalThis as unknown as { __reubenLeagueStore?: MemoryStore }

function memory(): MemoryStore {
  if (!globalForStore.__reubenLeagueStore) {
    globalForStore.__reubenLeagueStore = {
      leagues: [],
      teams: [],
      players: [],
      fixtures: [],
      tournaments: [],
      enquiries: [],
      results: {},
    }
  }
  return globalForStore.__reubenLeagueStore
}

function hasKv(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function readBucket<T>(bucket: Bucket): Promise<T[]> {
  if (hasKv()) {
    try {
      const { kv } = await import('@vercel/kv')
      const value = await kv.get<T[]>(KEYS[bucket])
      return Array.isArray(value) ? value : []
    } catch {
      return memory()[bucket] as unknown as T[]
    }
  }
  return memory()[bucket] as unknown as T[]
}

async function appendBucket<T>(bucket: Bucket, value: T): Promise<void> {
  if (hasKv()) {
    try {
      const { kv } = await import('@vercel/kv')
      const existing = await readBucket<T>(bucket)
      await kv.set(KEYS[bucket], [value, ...existing])
      return
    } catch {
      // fall through to memory
    }
  }
  const list = memory()[bucket] as unknown as T[]
  list.unshift(value)
}

async function writeResult(fixture: Fixture): Promise<void> {
  if (hasKv()) {
    try {
      const { kv } = await import('@vercel/kv')
      const existing = await kv.get<Record<string, Fixture>>('reuben-league:results')
      const store = existing && typeof existing === 'object' ? existing : {}
      store[fixture.id] = fixture
      await kv.set('reuben-league:results', store)
      return
    } catch {
      // fall through to memory
    }
  }
  memory().results[fixture.id] = fixture
}

async function readResults(): Promise<Record<string, Fixture>> {
  if (hasKv()) {
    try {
      const { kv } = await import('@vercel/kv')
      const existing = await kv.get<Record<string, Fixture>>('reuben-league:results')
      return existing && typeof existing === 'object' ? existing : {}
    } catch {
      return memory().results
    }
  }
  return memory().results
}

function mergeByKey<T>(seed: T[], extra: T[], key: (item: T) => string): T[] {
  const map = new Map<string, T>()
  for (const item of seed) map.set(key(item), item)
  for (const item of extra) map.set(key(item), item)
  return [...map.values()]
}

export async function getLeagues(): Promise<League[]> {
  const seed = getSeedData().leagues
  const extra = await readBucket<League>('leagues')
  const merged = mergeByKey(seed, extra, (league) => league.slug)
  const order = ['Active', 'Upcoming', 'Completed']
  return merged.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || a.name.localeCompare(b.name))
}

export async function getLeague(slug: string): Promise<League | undefined> {
  const leagues = await getLeagues()
  return leagues.find((league) => league.slug === slug)
}

export async function getTeams(leagueSlug?: string): Promise<Team[]> {
  const seed = getSeedData().teams
  const extra = await readBucket<Team>('teams')
  const merged = mergeByKey(seed, extra, (team) => team.slug)
  const filtered = leagueSlug ? merged.filter((team) => team.leagueSlug === leagueSlug) : merged
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getTeam(slug: string): Promise<Team | undefined> {
  const teams = await getTeams()
  return teams.find((team) => team.slug === slug)
}

export async function getPlayers(leagueSlug?: string): Promise<Player[]> {
  const seed = getSeedData().players
  const extra = await readBucket<Player>('players')
  const merged = mergeByKey(seed, extra, (player) => player.id)
  return leagueSlug ? merged.filter((player) => player.leagueSlug === leagueSlug) : merged
}

export async function getReferees(leagueSlug?: string): Promise<Referee[]> {
  const seed = getSeedData().referees
  return leagueSlug ? seed.filter((referee) => referee.leagueSlug === leagueSlug) : seed
}

function sortFixtures(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort((a, b) =>
    a.kickoff === b.kickoff ? a.time.localeCompare(b.time) : a.kickoff.localeCompare(b.kickoff),
  )
}

export async function getFixtures(leagueSlug?: string): Promise<Fixture[]> {
  const seed = getSeedData().fixtures
  const extra = await readBucket<Fixture>('fixtures')
  const results = await readResults()
  const merged = new Map<string, Fixture>()
  for (const fixture of seed) merged.set(fixture.id, fixture)
  for (const fixture of extra) merged.set(fixture.id, fixture)
  for (const [id, fixture] of Object.entries(results)) merged.set(id, fixture)
  const list = sortFixtures([...merged.values()])
  return leagueSlug ? list.filter((fixture) => fixture.leagueSlug === leagueSlug) : list
}

export async function getFixture(id: string): Promise<Fixture | undefined> {
  const fixtures = await getFixtures()
  return fixtures.find((fixture) => fixture.id === id)
}

export async function createLeague(league: League): Promise<League> {
  await appendBucket('leagues', league)
  return league
}

export async function createTeam(team: Team): Promise<Team> {
  await appendBucket('teams', team)
  return team
}

export async function createPlayer(player: Player): Promise<Player> {
  await appendBucket('players', player)
  return player
}

export async function createFixture(fixture: Fixture): Promise<Fixture> {
  await appendBucket('fixtures', fixture)
  return fixture
}

export async function saveResult(fixture: Fixture): Promise<Fixture> {
  await writeResult(fixture)
  return fixture
}

export async function saveTournamentRegistration(entry: TournamentRegistration): Promise<TournamentRegistration> {
  await appendBucket('tournaments', entry)
  return entry
}

export async function saveEnquiry(enquiry: Enquiry): Promise<Enquiry> {
  await appendBucket('enquiries', enquiry)
  return enquiry
}

export async function getTournamentRegistrations(): Promise<TournamentRegistration[]> {
  return readBucket<TournamentRegistration>('tournaments')
}
