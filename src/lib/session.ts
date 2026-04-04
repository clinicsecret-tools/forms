import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import type { SessionData } from '@/types'

export const sessionOptions = {
  password: process.env.SESSION_SECRET ?? 'fallback-dev-secret-change-in-production-32chars',
  cookieName: 'hipaa_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
  },
}

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.affiliateParams) session.affiliateParams = {}
  return session
}
