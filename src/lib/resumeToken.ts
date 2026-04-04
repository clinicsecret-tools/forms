import crypto from 'crypto'

export interface ResumeTokenPayload {
  token: string
  submissionId: string
  lastStep: number
  patientEmail?: string
  patientName?: string
  affiliateSnapshot: string  // JSON
  createdAt: number
  expiresAt: number
  usedAt?: number
}

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function generateResumeToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function buildResumePayload(
  submissionId: string,
  lastStep: number,
  affiliateParams: object,
  email?: string,
  name?: string,
): ResumeTokenPayload {
  const now = Date.now()
  return {
    token: generateResumeToken(),
    submissionId,
    lastStep,
    patientEmail: email,
    patientName: name,
    affiliateSnapshot: JSON.stringify(affiliateParams),
    createdAt: now,
    expiresAt: now + TOKEN_TTL_MS,
  }
}

export function buildResumeUrl(baseUrl: string, token: string, submissionId: string): string {
  const url = new URL('/resume', baseUrl)
  url.searchParams.set('token', token)
  url.searchParams.set('sid', submissionId)
  return url.toString()
}

export function buildDirectProductUrl(
  baseUrl: string,
  token: string,
  submissionId: string,
  affiliateParams?: Record<string, string>,
): string {
  const url = new URL('/products', baseUrl)
  url.searchParams.set('token', token)
  url.searchParams.set('sid', submissionId)
  url.searchParams.set('direct', '1')
  if (affiliateParams) {
    for (const [k, v] of Object.entries(affiliateParams)) {
      if (v) url.searchParams.set(k, v)
    }
  }
  return url.toString()
}

export function isTokenExpired(p: ResumeTokenPayload): boolean {
  return Date.now() > p.expiresAt
}

export function isTokenUsed(p: ResumeTokenPayload): boolean {
  return !!p.usedAt
}
