import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'

// Lightweight read-only endpoint — products page calls this to get patient name
// when arriving via a direct link (so we can personalise the heading)
export async function GET() {
  const session = await getSession()
  let painLevel: number | null = null

  if (session.submissionId) {
    try {
      const step10 = await prisma.stepAnswer.findUnique({
        where: {
          submissionId_step: {
            submissionId: session.submissionId,
            step: 10,
          },
        },
        select: {
          answersJson: true,
        },
      })

      if (step10?.answersJson) {
        const parsed = JSON.parse(step10.answersJson) as { painLevel?: string | number }
        const normalized = typeof parsed.painLevel === 'number'
          ? parsed.painLevel
          : Number.parseInt(String(parsed.painLevel ?? ''), 10)

        if (Number.isFinite(normalized)) {
          painLevel = Math.min(10, Math.max(1, normalized))
        }
      }
    } catch (error) {
      console.error('[session/summary] failed to read pain level', error)
    }
  }

  return NextResponse.json({
    name: session.patientName ?? null,
    email: session.patientEmail ?? null,
    painLevel,
    lastStep: session.lastStepReached ?? null,
    hasSubmission: !!session.submissionId,
  })
}
