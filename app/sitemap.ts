import type { MetadataRoute } from 'next'
import { getLeagues, getTeams } from '@/lib/store'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reubenleague.co.ke'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [leagues, teams] = await Promise.all([getLeagues(), getTeams()])

  const staticRoutes = [
    '',
    '/leagues',
    '/about',
    '/register-tournament',
    '/login',
    '/legal/privacy-policy',
    '/legal/terms',
    '/legal/cookie-policy',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/leagues' ? ('daily' as const) : ('monthly' as const),
    priority: path === '' ? 1 : 0.7,
  }))

  return [
    ...staticRoutes,
    ...leagues.map((league) => ({
      url: `${BASE}/league/${league.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...teams.map((team) => ({
      url: `${BASE}/team/${team.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
