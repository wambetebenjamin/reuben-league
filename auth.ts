import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { timingSafeEqual } from 'node:crypto'

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'admin@reubenleague.co.ke').toLowerCase()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'reuben-admin'

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

const providers = [
  Credentials({
    id: 'credentials',
    name: 'Email and password',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const email = String(credentials?.email ?? '').trim().toLowerCase()
      const password = String(credentials?.password ?? '')
      if (!email || !password) return null
      if (!safeEqual(email, ADMIN_EMAIL)) return null
      if (!safeEqual(password, ADMIN_PASSWORD)) return null
      return { id: 'admin', name: 'Reuben League Admin', email: ADMIN_EMAIL, role: 'admin' }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }) as never,
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? 'reuben-league-development-secret',
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      const email = String(token.email ?? user?.email ?? '').toLowerCase()
      token.role = email === ADMIN_EMAIL ? 'admin' : 'user'
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role === 'admin' ? 'admin' : 'user'
      }
      return session
    },
  },
})

export function isAdminSession(session: { user?: { role?: string } } | null): boolean {
  return session?.user?.role === 'admin'
}
