export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254112272061'

export const WHATSAPP_REGISTER_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Reuben%20League%2C%20I%27d%20like%20to%20register%20my%20tournament`

export const SITE = {
  name: 'Reuben League',
  tagline: 'Every game counts. Every table is live.',
  description:
    'Reuben League is the sports league and results management platform for Kenyan community tournaments. Real time fixtures, live standings, results and top scorer tables for football, basketball, volleyball, rugby sevens and netball.',
  email: 'hello@reubenleague.co.ke',
  county: 'Nairobi, Kenya',
  whatsapp: WHATSAPP_NUMBER,
  nav: [
    { href: '/leagues', label: 'Leagues' },
    { href: '/about', label: 'About' },
    { href: '/register-tournament', label: 'Register a tournament' },
  ],
  social: {
    facebook: 'https://www.facebook.com/',
    x: 'https://x.com/',
    instagram: 'https://www.instagram.com/',
  },
} as const

export const CHART_COLORS = {
  primary: '#f23a2e',
  black: '#000000',
  accent: '#f89d13',
  green: '#8bc34a',
  muted: '#ababab',
  line: '#edf0f5',
  ink: '#25262a',
} as const
