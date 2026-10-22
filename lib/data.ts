import type {
  Fixture,
  GoalType,
  League,
  LeagueStatus,
  MatchEvent,
  MatchStats,
  Player,
  Referee,
  Sport,
  Team,
} from './types'

/**
 * Deterministic seed data for Reuben League.
 *
 * Every value is produced from a fixed seed so server and client renders match.
 * Standings, top scorers and match statistics are all derived from the fixture
 * list below, which means an admin entering a result in /admin/results/enter
 * updates every table on the site through the same code path.
 */

const KENYAN_FIRST_NAMES = [
  'Brian', 'Kevin', 'Dennis', 'Collins', 'Wycliffe', 'Kelvin', 'Victor', 'Samuel', 'Peter', 'John',
  'Moses', 'Elijah', 'Isaac', 'George', 'Felix', 'Vincent', 'Stephen', 'Anthony', 'Emmanuel', 'Cyrus',
  'Boniface', 'Geoffrey', 'Dominic', 'Alvin', 'Baraka', 'Juma', 'Reuben', 'Martin', 'Nicholas', 'Eric',
  'Allan', 'Hillary', 'Duncan', 'Mercy', 'Faith', 'Grace', 'Sharon', 'Cynthia', 'Brenda', 'Winnie',
  'Esther', 'Millicent', 'Nancy', 'Joyce', 'Purity', 'Beatrice', 'Lydia', 'Janet', 'Susan', 'Mary',
]

const KENYAN_SURNAMES = [
  'Ochieng', 'Otieno', 'Owino', 'Wekesa', 'Wafula', 'Barasa', 'Kiptoo', 'Kariuki', 'Mwangi', 'Njoroge',
  'Kamau', 'Odhiambo', 'Onyango', 'Nyongesa', 'Mutua', 'Kilonzo', 'Juma', 'Omondi', 'Kiplagat',
  'Cheruiyot', 'Njuguna', 'Gitau', 'Maina', 'Waweru', 'Anyango', 'Achieng', 'Nafula', 'Simiyu',
  'Rotich', 'Kiplimo', 'Chebet', 'Kimani', 'Mbugua', 'Oduor', 'Owuor', 'Sang', 'Korir', 'Muli',
]

const REFEREE_NAMES = [
  'Patrick Oduor', 'Stephen Kariuki', 'Faith Wanjiru', 'Joseph Kiptanui', 'Mary Atieno',
  'Hassan Mwinyi', 'Grace Njeri', 'Daniel Waweru', 'Lilian Chebet', 'Charles Omondi',
  'Reuben Mutiso', 'Amina Said',
]

function hashString(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function rngFor(key: string) {
  return mulberry32(hashString(key))
}

function pick<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length) % list.length]
}

function intBetween(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

function isoDate(base: string, addDays: number): string {
  const date = new Date(`${base}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + addDays)
  return date.toISOString().slice(0, 10)
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const POSITIONS: Record<Sport, string[]> = {
  Football: ['Goalkeeper', 'Defender', 'Defender', 'Defender', 'Defender', 'Midfielder', 'Midfielder', 'Midfielder', 'Forward', 'Forward', 'Forward'],
  Basketball: ['Guard', 'Guard', 'Forward', 'Forward', 'Center', 'Guard', 'Forward', 'Center', 'Guard'],
  Volleyball: ['Setter', 'Libero', 'Outside Hitter', 'Outside Hitter', 'Middle Blocker', 'Middle Blocker', 'Opposite', 'Setter', 'Libero'],
  'Rugby Sevens': ['Prop', 'Hooker', 'Fly-half', 'Centre', 'Centre', 'Wing', 'Fullback', 'Prop', 'Wing'],
  Netball: ['Goal Shooter', 'Goal Attack', 'Wing Attack', 'Centre', 'Wing Defence', 'Goal Defence', 'Goal Keeper', 'Goal Shooter', 'Centre'],
}

interface LeagueConfig {
  slug: string
  code: string
  name: string
  sport: Sport
  county: string
  seasonStart: string
  seasonEnd: string
  status: LeagueStatus
  organiser: string
  venue: string
  blurb: string
  teams: string[]
  grounds: string[]
  rounds: number
  completedRounds: number
}

const LEAGUE_CONFIGS: LeagueConfig[] = [
  {
    slug: 'nairobi-community-premier-league',
    code: 'ncpl',
    name: 'Nairobi Community Premier League',
    sport: 'Football',
    county: 'Nairobi',
    seasonStart: '2026-08-29',
    seasonEnd: '2027-03-20',
    status: 'Active',
    organiser: 'Reuben League Nairobi County Board',
    venue: 'Camp Toyoyo, Jericho',
    blurb:
      'Twelve estate sides from Kibera to Embakasi playing a full home and away calendar. Matchday 8 is underway with three points separating the top four.',
    teams: [
      'Kibera Black Stars', 'Mathare United Youth', 'Eastlands Rangers', 'Kawangware Flyers',
      'Dandora Lions', 'Kayole All Stars', 'Ruaraka Warriors', 'Embakasi United',
      'Korogocho City', 'Mukuru Royals', 'Kangemi Athletic', 'Huruma Rovers',
    ],
    grounds: [
      'Camp Toyoyo, Jericho', 'Mathare Social Hall Ground', 'Eastleigh High School Ground',
      'Kawangware Stadium', 'Dandora Stadium', 'Kayole Community Ground', 'Ruaraka Grounds',
      'Embakasi Social Hall', 'Korogocho Ground', 'Mukuru Kwa Njenga Ground', 'Kangemi Ground',
      'Huruma Community Ground',
    ],
    rounds: 11,
    completedRounds: 8,
  },
  {
    slug: 'mombasa-coast-basketball-series',
    code: 'mcbs',
    name: 'Mombasa Coast Basketball Series',
    sport: 'Basketball',
    county: 'Mombasa',
    seasonStart: '2026-08-15',
    seasonEnd: '2026-12-19',
    status: 'Active',
    organiser: 'Coast Hoops Association',
    venue: 'Mombasa Sports Club',
    blurb:
      'The coast series runs eight island and mainland clubs through a fast seven-round schedule with games every Saturday afternoon.',
    teams: [
      'Mombasa Titans', 'Likoni Heat', 'Nyali Storm', 'Bamburi Eagles',
      'Tudor Kings', 'Changamwe Vipers', 'Diani Waves', 'Old Town Legends',
    ],
    grounds: [
      'Mombasa Sports Club', 'Likoni Community Court', 'Nyali Primary Court', 'Bamburi Social Hall Court',
      'Tudor Estate Court', 'Changamwe Grounds', 'Diani Beach Court', 'Old Town Court',
    ],
    rounds: 7,
    completedRounds: 4,
  },
  {
    slug: 'kisumu-lakeside-volleyball-cup',
    code: 'klvc',
    name: 'Kisumu Lakeside Volleyball Cup',
    sport: 'Volleyball',
    county: 'Kisumu',
    seasonStart: '2026-09-05',
    seasonEnd: '2026-12-12',
    status: 'Active',
    organiser: 'Lakeside Sports Federation',
    venue: 'Jomo Kenyatta Sports Ground',
    blurb:
      'Beach and indoor sides from Kisumu, Siaya and Bondo meet across four weekends of pool play and knockout rounds.',
    teams: [
      'Kisumu Lakers', 'Ahero Spikers', 'Maseno Vipers', 'Bondo Bay',
      'Kondele Nets', 'Muhoroni Stars', 'Siaya Rovers', 'Nyando Blazers',
    ],
    grounds: [
      'Jomo Kenyatta Sports Ground', 'Ahero Shopping Centre Court', 'Maseno University Court',
      'Bondo Social Hall Court', 'Kondele Community Court', 'Muhoroni Stadium Court',
      'Siaya Sports Ground', 'Nyando Community Court',
    ],
    rounds: 7,
    completedRounds: 3,
  },
  {
    slug: 'nakuru-rugby-sevens-circuit',
    code: 'nrsc',
    name: 'Nakuru Rugby Sevens Circuit',
    sport: 'Rugby Sevens',
    county: 'Nakuru',
    seasonStart: '2026-11-07',
    seasonEnd: '2027-02-06',
    status: 'Upcoming',
    organiser: 'Rift Valley Rugby Union',
    venue: 'Nakuru Athletic Club',
    blurb:
      'Eight Rift Valley clubs enter the new circuit in November. Fixtures, referees and venues are confirmed and published below.',
    teams: [
      'Nakuru Rhinos', 'Naivasha Rams', 'Gilgil Bulls', 'Njoro Warriors',
      'Bahati Hornets', 'Molo Chargers', 'Keringet Sevens', 'Elementaita Falcons',
    ],
    grounds: [
      'Nakuru Athletic Club', 'Naivasha Sports Club', 'Gilgil Rugby Ground', 'Njoro Boys Ground',
      'Bahati Social Ground', 'Molo Stadium', 'Keringet Ground', 'Elementaita Ground',
    ],
    rounds: 7,
    completedRounds: 0,
  },
  {
    slug: 'eldoret-netball-championship',
    code: 'enc',
    name: 'Eldoret Netball Championship',
    sport: 'Netball',
    county: 'Uasin Gishu',
    seasonStart: '2026-03-07',
    seasonEnd: '2026-07-25',
    status: 'Completed',
    organiser: 'Uasin Gishu Netball Association',
    venue: 'Eldoret Sports Club',
    blurb:
      'The 2026 championship closed in July after seven rounds. Eldoret Queens took the title with a game to spare.',
    teams: [
      'Eldoret Queens', 'Iten Arrows', 'Kapsabet Stars', 'Nandi Diamonds',
      'Turbo Jets', 'Moiben Falcons', 'Burnt Forest Roses', 'Kesses Comets',
    ],
    grounds: [
      'Eldoret Sports Club', 'Iten Stadium Court', 'Kapsabet Social Ground', 'Nandi Hills Court',
      'Turbo Grounds', 'Moiben Community Court', 'Burnt Forest Court', 'Kesses Ground',
    ],
    rounds: 7,
    completedRounds: 7,
  },
  {
    slug: 'kakamega-community-football-league',
    code: 'kcfl',
    name: 'Kakamega Community Football League',
    sport: 'Football',
    county: 'Kakamega',
    seasonStart: '2026-11-14',
    seasonEnd: '2027-04-17',
    status: 'Upcoming',
    organiser: 'Western Kenya Community Sports',
    venue: 'Bukhungu Stadium',
    blurb:
      'Ten western Kenya sides have registered for the new season. Squad lists are open to organisers through the admin dashboard.',
    teams: [
      'Kakamega Homeboys', 'Mumias Warriors', 'Bungoma Border', 'Butere United',
      'Lurambi Rangers', 'Shinyalu Stars', 'Emuhaya City', 'Vihiga Rovers',
      'Webuye Falls', 'Mumias Youth',
    ],
    grounds: [
      'Bukhungu Stadium', 'Mumias Grounds', 'Bungoma Stadium', 'Butere Ground',
      'Lurambi Ground', 'Shinyalu Ground', 'Emuhaya Ground', 'Vihiga Ground', 'Webuye Ground',
      'Mumias Youth Ground',
    ],
    rounds: 9,
    completedRounds: 0,
  },
  {
    slug: 'kajiado-youth-basketball-league',
    code: 'kybl',
    name: 'Kajiado Youth Basketball League',
    sport: 'Basketball',
    county: 'Kajiado',
    seasonStart: '2026-01-24',
    seasonEnd: '2026-05-30',
    status: 'Completed',
    organiser: 'Kajiado Youth Sports Trust',
    venue: 'Ongata Rongai Sports Ground',
    blurb:
      'The youth league wrapped in May with six clubs and a full five-round calendar. Full results and scorer lists remain online.',
    teams: [
      'Kajiado Suns', 'Kitengela Kings', 'Ngong Hills', 'Ongata Rongai Bulls',
      'Namanga Warriors', 'Isinya Jets',
    ],
    grounds: [
      'Ongata Rongai Sports Ground', 'Kitengela Social Court', 'Ngong Town Court',
      'Ongata Rongai Primary Court', 'Namanga Ground', 'Isinya Ground',
    ],
    rounds: 5,
    completedRounds: 5,
  },
]

function buildSquad(league: League, team: Team, index: number): Player[] {
  const rng = rngFor(`squad-${league.slug}-${team.slug}-${index}`)
  const positions = POSITIONS[league.sport]
  const used = new Set<string>()
  const players: Player[] = []
  const numbers = new Set<number>()

  for (let i = 0; i < positions.length; i += 1) {
    let name = ''
    let guard = 0
    do {
      name = `${pick(rng, KENYAN_FIRST_NAMES)} ${pick(rng, KENYAN_SURNAMES)}`
      guard += 1
    } while (used.has(name) && guard < 40)
    used.add(name)

    let jersey = intBetween(rng, 1, 30)
    while (numbers.has(jersey)) {
      jersey = intBetween(rng, 1, 30)
    }
    numbers.add(jersey)

    players.push({
      id: `${slugify(team.slug)}-p${i + 1}`,
      name,
      teamSlug: team.slug,
      leagueSlug: league.slug,
      position: positions[i],
      jersey,
      dateOfBirth: `${intBetween(rng, 1994, 2007)}-${String(intBetween(rng, 1, 12)).padStart(2, '0')}-${String(intBetween(rng, 1, 28)).padStart(2, '0')}`,
    })
  }

  return players
}

function roundRobin(slugs: string[], rounds: number): [string, string][][] {
  const teams = [...slugs]
  if (teams.length % 2 !== 0) teams.push('BYE')
  const size = teams.length
  const schedule: [string, string][][] = []

  for (let round = 0; round < size - 1; round += 1) {
    const pairs: [string, string][] = []
    for (let i = 0; i < size / 2; i += 1) {
      const home = teams[i]
      const away = teams[size - 1 - i]
      if (home !== 'BYE' && away !== 'BYE') {
        pairs.push(round % 2 === 0 ? [home, away] : [away, home])
      }
    }
    schedule.push(pairs)
    const last = teams.pop()
    if (last) teams.splice(1, 0, last)
  }

  return schedule.slice(0, rounds)
}

function buildEvents(
  fixtureId: string,
  sport: Sport,
  homeSlug: string,
  awaySlug: string,
  homeScore: number,
  awayScore: number,
  squads: Map<string, Player[]>,
): MatchEvent[] {
  const events: MatchEvent[] = []
  const homeSquad = squads.get(homeSlug) ?? []
  const awaySquad = squads.get(awaySlug) ?? []

  const scorerFor = (teamSlug: string, rng: () => number): Player => {
    const squad = squads.get(teamSlug) ?? []
    if (squad.length === 0) return homeSquad[0]
    const weights = squad.map((player) => {
      if (player.position.includes('Forward') || player.position.includes('Shooter') || player.position.includes('Wing')) return 6
      if (player.position.includes('Mid') || player.position.includes('Centre') || player.position.includes('Fly')) return 4
      if (player.position.includes('Guard') || player.position.includes('Hitter')) return 3
      if (player.position.includes('Goalkeeper') || player.position.includes('Goal Keeper')) return 0.2
      return 1
    })
    const total = weights.reduce((sum, weight) => sum + weight, 0)
    let target = rng() * total
    for (let i = 0; i < squad.length; i += 1) {
      target -= weights[i]
      if (target <= 0) return squad[i]
    }
    return squad[0]
  }

  const addGoalsFor = (teamSlug: string, opponentSlug: string, count: number) => {
    for (let i = 0; i < count; i += 1) {
      const rng = rngFor(`${fixtureId}-goal-${teamSlug}-${i}`)
      const scorer = scorerFor(teamSlug, rng)
      const roll = rng()
      const ownGoal = roll > 0.955
      const penalty = !ownGoal && roll > 0.87
      const type: GoalType = ownGoal ? 'own goal' : penalty ? 'penalty' : 'goal'
      const teammate = scorerFor(teamSlug, rngFor(`${fixtureId}-assist-${teamSlug}-${i}`))
      events.push({
        id: `${fixtureId}-g${i}-${teamSlug.slice(0, 6)}`,
        type,
        teamSlug,
        playerName: ownGoal ? scorerFor(opponentSlug, rng).name : scorer.name,
        minute: intBetween(rng, 3, 88),
        assist: ownGoal || penalty ? undefined : teammate.name === scorer.name ? undefined : teammate.name,
      })
    }
  }

  addGoalsFor(homeSlug, awaySlug, homeScore)
  addGoalsFor(awaySlug, homeSlug, awayScore)

  const cardTypes: Array<'yellow' | 'red'> = ['yellow', 'yellow', 'yellow', 'yellow', 'red']
  const cardCount = intBetween(rngFor(`${fixtureId}-cards`), 0, 4)
  for (let i = 0; i < cardCount; i += 1) {
    const rng = rngFor(`${fixtureId}-card-${i}`)
    const teamSlug = rng() > 0.5 ? homeSlug : awaySlug
    const squad = squads.get(teamSlug) ?? []
    const player = squad.length ? squad[intBetween(rng, 0, squad.length - 1)] : homeSquad[0]
    events.push({
      id: `${fixtureId}-c${i}`,
      type: pick(rng, cardTypes),
      teamSlug,
      playerName: player?.name ?? 'Unknown',
      minute: intBetween(rng, 12, 90),
    })
  }

  return events.sort((a, b) => a.minute - b.minute)
}

function buildStats(fixtureId: string): MatchStats {
  const rng = rngFor(`${fixtureId}-stats`)
  const possession = intBetween(rng, 41, 59)
  return {
    possession: [possession, 100 - possession],
    shots: [intBetween(rng, 6, 19), intBetween(rng, 5, 17)],
    corners: [intBetween(rng, 2, 9), intBetween(rng, 1, 8)],
    fouls: [intBetween(rng, 6, 16), intBetween(rng, 5, 15)],
  }
}

function scoreFor(fixtureId: string, sport: Sport, homeSlug: string, awaySlug: string): [number, number] {
  const rng = rngFor(`score-${fixtureId}-${homeSlug}-${awaySlug}`)
  const homeBoost = 0.15
  const ceiling = sport === 'Football' ? 4 : sport === 'Basketball' ? 9 : 5

  const roll = (boost: number) => {
    const value = rng() + boost
    if (value > 0.86) return intBetween(rng, 3, ceiling)
    if (value > 0.6) return 2
    if (value > 0.34) return 1
    return 0
  }

  return [roll(homeBoost), roll(0)]
}

interface SeedResult {
  leagues: League[]
  teams: Team[]
  players: Player[]
  fixtures: Fixture[]
  referees: Referee[]
}

let cached: SeedResult | null = null

export function getSeedData(): SeedResult {
  if (cached) return cached

  const leagues: League[] = []
  const teams: Team[] = []
  const players: Player[] = []
  const fixtures: Fixture[] = []
  const referees: Referee[] = []

  for (const config of LEAGUE_CONFIGS) {
    const league: League = {
      slug: config.slug,
      code: config.code,
      name: config.name,
      sport: config.sport,
      county: config.county,
      season: `${new Date(config.seasonStart).getUTCFullYear()}/${String(new Date(config.seasonEnd).getUTCFullYear()).slice(2)}`,
      seasonStart: config.seasonStart,
      seasonEnd: config.seasonEnd,
      teamCount: config.teams.length,
      status: config.status,
      organiser: config.organiser,
      venue: config.venue,
      blurb: config.blurb,
    }
    leagues.push(league)

    const leagueTeams: Team[] = config.teams.map((name, index) => ({
      slug: slugify(name),
      name,
      leagueSlug: league.slug,
      homeGround: config.grounds[index] ?? league.venue,
      coach: `${pick(rngFor(`coach-${name}`), KENYAN_FIRST_NAMES)} ${pick(rngFor(`coach2-${name}`), KENYAN_SURNAMES)}`,
      county: config.county,
      founded: intBetween(rngFor(`founded-${name}`), 1988, 2019),
    }))
    teams.push(...leagueTeams)

    const leaguePlayers: Player[] = []
    leagueTeams.forEach((team, index) => {
      leaguePlayers.push(...buildSquad(league, team, index))
    })
    players.push(...leaguePlayers)

    const squads = new Map<string, Player[]>()
    for (const player of leaguePlayers) {
      const list = squads.get(player.teamSlug) ?? []
      list.push(player)
      squads.set(player.teamSlug, list)
    }

    const leagueReferees: Referee[] = REFEREE_NAMES.map((name, index) => ({
      id: `${league.code}-ref-${index + 1}`,
      name,
      county: config.county,
      level: index < 4 ? 'County level 1' : index < 8 ? 'County level 2' : 'Regional panel',
      leagueSlug: league.slug,
    }))
    referees.push(...leagueReferees)

    const schedule = roundRobin(leagueTeams.map((team) => team.slug), config.rounds)
    const venuesByTeam = new Map(leagueTeams.map((team) => [team.slug, team.homeGround]))

    schedule.forEach((pairs, roundIndex) => {
      const kickoffDate = isoDate(config.seasonStart, roundIndex * 7)
      pairs.forEach((pair, matchIndex) => {
        const [homeSlug, awaySlug] = pair
        const id = `${league.code}-r${roundIndex + 1}-${matchIndex + 1}`
        const completed = roundIndex < config.completedRounds
        const isLive =
          league.slug === 'nairobi-community-premier-league' &&
          roundIndex === config.completedRounds &&
          matchIndex === 0

        let homeScore: number | null = null
        let awayScore: number | null = null
        let events: MatchEvent[] = []
        let stats: MatchStats | null = null

        if (completed || isLive) {
          const [rawHome, rawAway] = scoreFor(id, league.sport, homeSlug, awaySlug)
          if (isLive) {
            homeScore = Math.min(Math.max(rawHome, 1), 2)
            awayScore = Math.min(rawAway, 1)
          } else {
            homeScore = rawHome
            awayScore = rawAway
          }
          events = buildEvents(id, league.sport, homeSlug, awaySlug, homeScore ?? 0, awayScore ?? 0, squads)
          stats = buildStats(id)
        }

        fixtures.push({
          id,
          leagueSlug: league.slug,
          round: roundIndex + 1,
          homeSlug,
          awaySlug,
          kickoff: isLive ? new Date().toISOString().slice(0, 10) : kickoffDate,
          time: ['13:00', '15:00', '16:00'][matchIndex % 3],
          venue: venuesByTeam.get(homeSlug) ?? league.venue,
          referee: leagueReferees[(roundIndex + matchIndex) % leagueReferees.length].name,
          status: completed ? 'Full Time' : isLive ? 'Live' : 'Upcoming',
          homeScore,
          awayScore,
          events,
          stats,
        })
      })
    })
  }

  cached = { leagues, teams, players, fixtures, referees }
  return cached
}

export const SPORTS: Sport[] = ['Football', 'Basketball', 'Volleyball', 'Rugby Sevens', 'Netball']

export const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kakamega', 'Kajiado', 'Kiambu',
  'Machakos', 'Nyeri', 'Meru', 'Bungoma', 'Homa Bay', 'Kilifi', 'Kisii', 'Migori',
]
