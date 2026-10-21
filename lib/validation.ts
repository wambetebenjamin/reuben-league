import { z } from 'zod'
import { SPORTS } from './data'

const sportEnum = z.enum(['Football', 'Basketball', 'Volleyball', 'Rugby Sevens', 'Netball'])

const nameField = z
  .string()
  .trim()
  .min(2, 'Enter at least 2 characters')
  .max(120, 'Keep this under 120 characters')

const optionalText = z.string().trim().max(1200).optional().or(z.literal(''))

export const leagueSchema = z
  .object({
    name: nameField,
    sport: sportEnum,
    county: z.string().trim().min(2, 'Select a county'),
    seasonStart: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid start date'),
    seasonEnd: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid end date'),
    teamCount: z.coerce.number().int().min(2, 'A league needs at least 2 teams').max(64, 'Maximum is 64 teams'),
    organiser: optionalText,
    description: optionalText,
    recaptchaToken: z.string().optional(),
  })
  .refine((value) => new Date(value.seasonEnd) > new Date(value.seasonStart), {
    message: 'Season end must fall after the start date',
    path: ['seasonEnd'],
  })

export const fixtureSchema = z
  .object({
    leagueSlug: z.string().trim().min(1, 'Select a league'),
    homeSlug: z.string().trim().min(1, 'Select the home team'),
    awaySlug: z.string().trim().min(1, 'Select the away team'),
    date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid date'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Use the 24 hour clock, for example 15:00'),
    venue: nameField,
    referee: nameField,
    recaptchaToken: z.string().optional(),
  })
  .refine((value) => value.homeSlug !== value.awaySlug, {
    message: 'A team cannot play itself',
    path: ['awaySlug'],
  })

const goalSchema = z.object({
  playerName: z.string().trim().min(2, 'Player name is required'),
  minute: z.coerce.number().int().min(1, 'Minute must be 1 or more').max(120, 'Minute must be 120 or less'),
  type: z.enum(['goal', 'penalty', 'own goal']).default('goal'),
  team: z.enum(['home', 'away']).default('home'),
})

const cardSchema = z.object({
  playerName: z.string().trim().min(2, 'Player name is required'),
  minute: z.coerce.number().int().min(1, 'Minute must be 1 or more').max(120, 'Minute must be 120 or less'),
  type: z.enum(['yellow', 'red']).default('yellow'),
  team: z.enum(['home', 'away']).default('home'),
})

export const resultSchema = z
  .object({
    fixtureId: z.string().trim().min(1, 'Select a fixture'),
    homeScore: z.coerce.number().int().min(0, 'Score cannot be negative').max(99),
    awayScore: z.coerce.number().int().min(0, 'Score cannot be negative').max(99),
    scorers: z.array(goalSchema).max(30).optional(),
    cards: z.array(cardSchema).max(30).optional(),
    recaptchaToken: z.string().optional(),
  })
  .refine((value) => (value.scorers?.length ?? 0) <= value.homeScore + value.awayScore || (value.scorers?.length ?? 0) === 0, {
    message: 'More goal events than goals. Check the scores and scorer list',
    path: ['scorers'],
  })

export const teamSchema = z.object({
  name: nameField,
  homeGround: nameField,
  coach: nameField,
  county: z.string().trim().min(2, 'Select a county'),
  leagueSlug: z.string().trim().min(1, 'Select a league'),
  recaptchaToken: z.string().optional(),
})

export const playerSchema = z.object({
  name: nameField,
  teamSlug: z.string().trim().min(1, 'Select a team'),
  position: nameField,
  jersey: z.coerce.number().int().min(0, 'Jersey numbers start at 0').max(99, 'Maximum jersey number is 99'),
  dateOfBirth: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid date of birth'),
  recaptchaToken: z.string().optional(),
})

export const tournamentSchema = z.object({
  organiserName: nameField,
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?254|0)[17]\d{8}$/, 'Use a Kenyan number, for example 0712 345 678'),
  tournamentName: nameField,
  sport: sportEnum,
  county: z.string().trim().min(2, 'Select a county'),
  estimatedTeams: z.coerce.number().int().min(2, 'Enter at least 2 teams').max(128, 'Contact us for more than 128 teams'),
  startDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid start date'),
  notes: optionalText,
  recaptchaToken: z.string().optional(),
})

export const enquirySchema = z.object({
  name: nameField,
  email: z.string().trim().email('Enter a valid email address'),
  message: z.string().trim().min(10, 'Tell us a little more').max(1200, 'Keep this under 1200 characters'),
  recaptchaToken: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Passwords are at least 8 characters'),
})

export type LeagueFormValues = z.infer<typeof leagueSchema>
export type FixtureFormValues = z.infer<typeof fixtureSchema>
export type ResultFormValues = z.infer<typeof resultSchema>
export type TeamFormValues = z.infer<typeof teamSchema>
export type PlayerFormValues = z.infer<typeof playerSchema>
export type TournamentFormValues = z.infer<typeof tournamentSchema>
export type EnquiryFormValues = z.infer<typeof enquirySchema>

export { SPORTS, sportEnum }
