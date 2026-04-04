/**
 * POST /api/resume/generate
 *
 * Generates a resume token + direct product URL on demand.
 * Called automatically by the step submit flow, and can also
 * be triggered manually (e.g. by an internal dashboard or CRON job
 * to refresh links for contacts who are about to receive a campaign).
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { buildResumePayload, buildResumeUrl, buildDirectProductUrl } from '@/lib/resumeToken'
import { pushResumeLinkToCRMs } from '@/lib/crmResumeSync'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    const { submissionId, lastStepReached, patientEmail, patientName, affiliateParams } = session

    if (!submissionId) {
      return NextResponse.json({ error: 'No active session' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!

    const payload = buildResumePayload(
      submissionId,
      lastStepReached ?? 1,
      affiliateParams ?? {},
      patientEmail,
      patientName,
    )

    const affiliateFlat: Record<string, string> = {}
    for (const [k, v] of Object.entries(affiliateParams ?? {})) {
      if (typeof v === 'string') affiliateFlat[k] = v
    }

    const resumeUrl  = buildResumeUrl(baseUrl, payload.token, submissionId)
    const productUrl = buildDirectProductUrl(baseUrl, payload.token, submissionId, affiliateFlat)

    // Persist to DB
    await prisma.resumeToken.create({
      data: {
        token: payload.token,
        submissionId: payload.submissionId,
        lastStep: payload.lastStep,
        patientEmail: payload.patientEmail,
        patientName: payload.patientName,
        affiliateSnapshot: payload.affiliateSnapshot,
        expiresAt: new Date(payload.expiresAt),
        tokenType: 'resume',
      },
    })

    // Invalidate older tokens for same submission
    await prisma.resumeToken.updateMany({
      where: { submissionId, token: { not: payload.token }, usedAt: null },
      data: { usedAt: new Date() },
    })

    // Push to CRMs
    if (patientEmail) {
      await pushResumeLinkToCRMs({
        email: patientEmail,
        name: patientName,
        submissionId,
        resumeUrl,
        productUrl,
        lastStep: lastStepReached ?? 1,
        affiliateParams: affiliateFlat,
      })
    }

    return NextResponse.json({
      ok: true,
      resumeUrl,
      productUrl,
      expiresAt: new Date(payload.expiresAt).toISOString(),
    })
  } catch (err) {
    console.error('[resume/generate]', err)
    return NextResponse.json({ error: 'Failed to generate resume link' }, { status: 500 })
  }
}
