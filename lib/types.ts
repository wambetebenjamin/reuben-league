export type Sport = 'Football' | 'Basketball' | 'Volleyball' | 'Rugby Sevens' | 'Netball'

export type LeagueStatus = 'Active' | 'Upcoming' | 'Completed'

export type MatchStatus = 'Upcoming' | 'Live' | 'Full Time'

export type GoalType = 'goal' | 'penalty' | 'own goal'

export interface League {
  slug: string
  code: string
  name: string
  sport: Sport
  county: string
  season: string
  seasonStart: string
  seasonEnd: string
  teamCount: number
  status: LeagueStatus
  organiser: string
  venue: string
  blurb: string
  createdAt?: string
}

export interface Team {
  slug: string
  name: string
  leagueSlug: string
  homeGround: string
  coach: string
  county: string
  founded: number
}

export interface Player {
  id: string
  name: string
  teamSlug: string
  leagueSlug: string
  position: string
  jersey: number
  dateOfBirth: string
}

export interface MatchEvent {
  id: string
  type: 'goal' | 'penalty' | 'own goal' | 'yellow' | 'red'
  teamSlug: string
  playerName: string
  minute: number
  assist?: string
}

export interface MatchStats {
  possession: [number, number]
  shots: [number, number]
  corners: [number, number]
  fouls: [number, number]
}

export interface Fixture {
  id: string
  leagueSlug: string
  round: number
  homeSlug: string
  awaySlug: string
  kickoff: string
  time: string
  venue: string
  referee: string
  status: MatchStatus
  homeScore: number | null
  awayScore: number | null
  events: MatchEvent[]
  stats: MatchStats | null
}

export interface Referee {
  id: string
  name: string
  county: string
  level: string
  leagueSlug: string
}

export interface StandingRow {
  position: number
  teamSlug: string
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface ScorerRow {
  playerId: string
  name: string
  teamSlug: string
  teamName: string
  goals: number
  assists: number
}

export interface PlayerTotals {
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export interface TournamentRegistration {
  id: string
  organiserName: string
  email: string
  phone: string
  tournamentName: string
  sport: Sport
  county: string
  estimatedTeams: number
  startDate: string
  notes: string
  createdAt: string
}

export interface Enquiry {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}
