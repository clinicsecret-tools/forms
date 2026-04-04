import { buildResumePayload, buildResumeUrl, buildDirectProductUrl } from '@/lib/resumeToken'
import { pushResumeLinkToCRMs } from '@/lib/crmResumeSync'
import type { SessionData } from '@/types'

export async function refreshResumeLink(session: SessionData): Promise<void> {
  const { submissionId, lastStepReached, patientEmail, patientName, affiliateParams } = session
  if (!submissionId || !patientEmail) return

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const payload = buildResumePayload(
    submissionId, lastStepReached ?? 1,
    affiliateParams ?? {}, patientEmail, patientName,
  )

  const affiliateFlat: Record<string,string> = {}
  for (const [k,v] of Object.entries(affiliateParams ?? {})) {
    if (typeof v === 'string') affiliateFlat[k] = v
  }

  const resumeUrl  = buildResumeUrl(baseUrl, payload.token, submissionId)
  const productUrl = buildDirectProductUrl(baseUrl, payload.token, submissionId, affiliateFlat)

  // Persist to DB if available
  try {
    const { prisma } = await import('@/lib/db')
    await prisma.resumeToken.create({
      data: {
        token: payload.token, submissionId, lastStep: payload.lastStep,
        patientEmail: payload.patientEmail, patientName: payload.patientName,
        affiliateSnapshot: payload.affiliateSnapshot,
        expiresAt: new Date(payload.expiresAt), tokenType: 'resume',
      },
    })
    // Invalidate older tokens
    await prisma.resumeToken.updateMany({
      where: { submissionId, token: { not: payload.token }, usedAt: null },
      data: { usedAt: new Date() },
    })
  } catch {
    // DB not set up — skip silently
  }

  // Push URLs to CRMs
  await pushResumeLinkToCRMs({
    email: patientEmail, name: patientName, submissionId,
    resumeUrl, productUrl, lastStep: lastStepReached ?? 1,
    affiliateParams: affiliateFlat,
  })
}
