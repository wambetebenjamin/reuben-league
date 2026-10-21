import type {
  Fixture,
  League,
  MatchEvent,
  Player,
  PlayerTotals,
  ScorerRow,
  StandingRow,
  Team,
} from './types'

export function computeStandings(league: League, teams: Team[], fixtures: Fixture[]): StandingRow[] {
  const leagueTeams = teams.filter((team) => team.leagueSlug === league.slug)
  const rows = new Map<string, StandingRow>()

  for (const team of leagueTeams) {
    rows.set(team.slug, {
      position: 0,
      teamSlug: team.slug,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    })
  }

  for (const fixture of fixtures) {
    if (fixture.leagueSlug !== league.slug) continue
    if (fixture.status !== 'Full Time') continue
    if (fixture.homeScore === null || fixture.awayScore === null) continue

    const home = rows.get(fixture.homeSlug)
    const away = rows.get(fixture.awaySlug)
    if (!home || !away) continue

    home.played += 1
    away.played += 1
    home.goalsFor += fixture.homeScore
    home.goalsAgainst += fixture.awayScore
    away.goalsFor += fixture.awayScore
    away.goalsAgainst += fixture.homeScore

    if (fixture.homeScore > fixture.awayScore) {
      home.won += 1
      home.points += 3
      away.lost += 1
    } else if (fixture.homeScore < fixture.awayScore) {
      away.won += 1
      away.points += 3
      home.lost += 1
    } else {
      home.drawn += 1
      away.drawn += 1
      home.points += 1
      away.points += 1
    }
  }

  const sorted = [...rows.values()]
    .map((row) => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.teamName.localeCompare(b.teamName),
    )
    .map((row, index) => ({ ...row, position: index + 1 }))

  return sorted
}

function eventTotals(fixtures: Fixture[]) {
  const goals = new Map<string, number>()
  const assists = new Map<string, number>()
  const yellows = new Map<string, number>()
  const reds = new Map<string, number>()

  const bump = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1)

  for (const fixture of fixtures) {
    for (const event of fixture.events) {
      if (event.type === 'yellow') {
        bump(yellows, event.playerName)
        continue
      }
      if (event.type === 'red') {
        bump(reds, event.playerName)
        continue
      }
      bump(goals, event.playerName)
      if (event.assist) bump(assists, event.assist)
    }
  }

  return { goals, assists, yellows, reds }
}

export function playerTotals(players: Player[], fixtures: Fixture[]): Map<string, PlayerTotals> {
  const { goals, assists, yellows, reds } = eventTotals(fixtures)
  const totals = new Map<string, PlayerTotals>()

  for (const player of players) {
    totals.set(player.id, {
      goals: goals.get(player.name) ?? 0,
      assists: assists.get(player.name) ?? 0,
      yellowCards: yellows.get(player.name) ?? 0,
      redCards: reds.get(player.name) ?? 0,
    })
  }

  return totals
}

export function computeTopScorers(
  league: League,
  teams: Team[],
  players: Player[],
  fixtures: Fixture[],
  limit = 20,
): ScorerRow[] {
  const leagueFixtures = fixtures.filter((fixture) => fixture.leagueSlug === league.slug)
  const totals = playerTotals(
    players.filter((player) => player.leagueSlug === league.slug),
    leagueFixtures,
  )
  const teamNames = new Map(teams.map((team) => [team.slug, team.name]))

  return players
    .filter((player) => player.leagueSlug === league.slug)
    .map((player) => {
      const total = totals.get(player.id) ?? { goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
      return {
        playerId: player.id,
        name: player.name,
        teamSlug: player.teamSlug,
        teamName: teamNames.get(player.teamSlug) ?? '',
        goals: total.goals,
        assists: total.assists,
      }
    })
    .filter((row) => row.goals > 0 || row.assists > 0)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name))
    .slice(0, limit)
}

export function formFor(teamSlug: string, fixtures: Fixture[], limit = 5): Array<'W' | 'D' | 'L'> {
  return fixtures
    .filter(
      (fixture) =>
        fixture.status === 'Full Time' &&
        (fixture.homeSlug === teamSlug || fixture.awaySlug === teamSlug) &&
        fixture.homeScore !== null &&
        fixture.awayScore !== null,
    )
    .sort((a, b) => (a.kickoff < b.kickoff ? 1 : -1))
    .slice(0, limit)
    .map((fixture) => {
      const isHome = fixture.homeSlug === teamSlug
      const own = (isHome ? fixture.homeScore : fixture.awayScore) ?? 0
      const other = (isHome ? fixture.awayScore : fixture.homeScore) ?? 0
      if (own > other) return 'W'
      if (own < other) return 'L'
      return 'D'
    })
}

export function highlightEvents(fixture: Fixture, types: MatchEvent['type'][]): MatchEvent[] {
  return fixture.events.filter((event) => types.includes(event.type))
}

export function teamSlugByName(teams: Team[], name: string): string | undefined {
  return teams.find((team) => team.name === name)?.slug
}
