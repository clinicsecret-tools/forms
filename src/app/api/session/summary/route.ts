import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

// Lightweight read-only endpoint — products page calls this to get patient name
// when arriving via a direct link (so we can personalise the heading)
export async function GET() {
  const session = await getSession()
  return NextResponse.json({
    name: session.patientName ?? null,
    email: session.patientEmail ?? null,
    lastStep: session.lastStepReached ?? null,
    hasSubmission: !!session.submissionId,
  })
}
