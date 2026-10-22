import { getFixtures, getLeague, getLeagues, getPlayers, getReferees, getTeam, getTeams } from './store'
import { computeStandings, computeTopScorers, formFor, playerTotals } from './standings'
import type { Fixture, League, Player, Referee, ScorerRow, StandingRow, Team } from './types'

export interface LeagueOverview {
  league: League
  teams: Team[]
  players: Player[]
  referees: Referee[]
  fixtures: Fixture[]
  standings: StandingRow[]
  scorers: ScorerRow[]
}

export async function getLeagueOverview(slug: string): Promise<LeagueOverview | null> {
  const league = await getLeague(slug)
  if (!league) return null

  const [teams, players, referees, fixtures] = await Promise.all([
    getTeams(slug),
    getPlayers(slug),
    getReferees(slug),
    getFixtures(slug),
  ])

  return {
    league,
    teams,
    players,
    referees,
    fixtures,
    standings: computeStandings(league, teams, fixtures),
    scorers: computeTopScorers(league, teams, players, fixtures, 20),
  }
}

function sortByKickoff(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort((a, b) =>
    a.kickoff === b.kickoff ? a.time.localeCompare(b.time) : a.kickoff.localeCompare(b.kickoff),
  )
}

export interface HomeData {
  leagues: League[]
  activeLeague: League
  standingsTop: StandingRow[]
  latestResults: Fixture[]
  upcomingFixtures: Fixture[]
  topScorers: ScorerRow[]
  teams: Team[]
  totalTeams: number
  totalFixtures: number
  liveFixtures: Fixture[]
}

export async function getHomeData(): Promise<HomeData> {
  const leagues = await getLeagues()
  const activeLeagues = leagues
    .filter((league) => league.status === 'Active')
    .sort((a, b) => b.teamCount - a.teamCount || a.name.localeCompare(b.name))
  const activeLeague = activeLeagues[0] ?? leagues[0]
  const [teams, players, fixtures] = await Promise.all([
    getTeams(activeLeague.slug),
    getPlayers(activeLeague.slug),
    getFixtures(activeLeague.slug),
  ])

  const standings = computeStandings(activeLeague, teams, fixtures)
  const teamNames = new Map(teams.map((team) => [team.slug, team.name]))
  const allTeams = await getTeams()

  const latestResults = sortByKickoff(fixtures.filter((fixture) => fixture.status === 'Full Time'))
    .reverse()
    .slice(0, 4)

  const upcomingFixtures = sortByKickoff(fixtures.filter((fixture) => fixture.status === 'Upcoming')).slice(0, 4)

  const liveFixtures = fixtures.filter((fixture) => fixture.status === 'Live')

  return {
    leagues,
    activeLeague,
    standingsTop: standings.slice(0, 5),
    latestResults,
    upcomingFixtures,
    topScorers: computeTopScorers(activeLeague, teams, players, fixtures, 5),
    teams: teams.map((team) => ({ ...team, name: teamNames.get(team.slug) ?? team.name })),
    totalTeams: allTeams.length,
    totalFixtures: (await getFixtures()).length,
    liveFixtures,
  }
}

export interface TeamProfile {
  team: Team
  league: League | undefined
  squad: Array<{ player: Player; goals: number; assists: number; yellowCards: number; redCards: number }>
  recentResults: Fixture[]
  upcoming: Fixture[]
  form: Array<'W' | 'D' | 'L'>
  position: number
  teams: Team[]
  fixtures: Fixture[]
}

export async function getTeamProfile(slug: string): Promise<TeamProfile | null> {
  const team = await getTeam(slug)
  if (!team) return null

  const [league, teams, players, fixtures] = await Promise.all([
    getLeague(team.leagueSlug),
    getTeams(team.leagueSlug),
    getPlayers(team.leagueSlug),
    getFixtures(team.leagueSlug),
  ])

  const totals = playerTotals(players, fixtures)
  const squad = players
    .filter((player) => player.teamSlug === team.slug)
    .map((player) => {
      const total = totals.get(player.id) ?? { goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
      return { player, ...total }
    })
    .sort((a, b) => a.player.jersey - b.player.jersey)

  const teamFixtures = fixtures.filter(
    (fixture) => fixture.homeSlug === team.slug || fixture.awaySlug === team.slug,
  )

  const recentResults = sortByKickoff(teamFixtures.filter((fixture) => fixture.status === 'Full Time'))
    .reverse()
    .slice(0, 5)

  const upcoming = sortByKickoff(teamFixtures.filter((fixture) => fixture.status !== 'Full Time')).slice(0, 3)

  const standings = league ? computeStandings(league, teams, fixtures) : []
  const position = standings.find((row) => row.teamSlug === team.slug)?.position ?? 0

  return {
    team,
    league,
    squad,
    recentResults,
    upcoming,
    form: formFor(team.slug, fixtures, 5),
    position,
    teams,
    fixtures,
  }
}

export interface MatchDetail {
  fixture: Fixture
  league: League | undefined
  home: Team | undefined
  away: Team | undefined
  teams: Team[]
  headToHead: Fixture[]
}

export async function getMatchDetail(id: string): Promise<MatchDetail | null> {
  const fixtures = await getFixtures()
  const fixture = fixtures.find((entry) => entry.id === id)
  if (!fixture) return null

  const league = await getLeague(fixture.leagueSlug)
  const teams = await getTeams(fixture.leagueSlug)
  const home = teams.find((team) => team.slug === fixture.homeSlug)
  const away = teams.find((team) => team.slug === fixture.awaySlug)

  const headToHead = fixtures.filter(
    (entry) =>
      entry.id !== fixture.id &&
      entry.leagueSlug === fixture.leagueSlug &&
      entry.status === 'Full Time' &&
      ((entry.homeSlug === fixture.homeSlug && entry.awaySlug === fixture.awaySlug) ||
        (entry.homeSlug === fixture.awaySlug && entry.awaySlug === fixture.homeSlug)),
  )

  return { fixture, league, home, away, teams, headToHead }
}

export interface AdminOverview {
  activeLeagues: number
  totalTeams: number
  matchesThisWeek: number
  upcomingFixtures: number
  weeks: Array<{ week: string; matches: number; played: number }>
  leagues: League[]
  fixtures: Fixture[]
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [leagues, teams, fixtures] = await Promise.all([getLeagues(), getTeams(), getFixtures()])

  const weekMap = new Map<string, { week: string; matches: number; played: number }>()
  for (const fixture of fixtures) {
    const key = fixture.kickoff
    const bucket = weekMap.get(key) ?? { week: key, matches: 0, played: 0 }
    bucket.matches += 1
    if (fixture.status === 'Full Time') bucket.played += 1
    weekMap.set(key, bucket)
  }

  const weeks = [...weekMap.values()].sort((a, b) => a.week.localeCompare(b.week)).slice(-10)

  const today = new Date()
  const start = new Date(today)
  start.setUTCDate(start.getUTCDate() - 3)
  const end = new Date(today)
  end.setUTCDate(end.getUTCDate() + 4)
  const startIso = start.toISOString().slice(0, 10)
  const endIso = end.toISOString().slice(0, 10)

  return {
    activeLeagues: leagues.filter((league) => league.status === 'Active').length,
    totalTeams: teams.length,
    matchesThisWeek: fixtures.filter((fixture) => fixture.kickoff >= startIso && fixture.kickoff <= endIso).length,
    upcomingFixtures: fixtures.filter((fixture) => fixture.status !== 'Full Time').length,
    weeks,
    leagues,
    fixtures,
  }
}
