import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/session'
import type { SessionData } from '@/types'

interface Props {
  searchParams: { token?: string; sid?: string; direct?: string }
}

export default async function ResumePage({ searchParams }: Props) {
  const { token, sid, direct } = searchParams
  const isDirect = direct === '1'

  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  // Path A: same device — session still alive
  if (session.submissionId && !token) {
    redirect(isDirect ? `/products?sid=${session.submissionId}&direct=1` : `/form/${session.lastStepReached ?? 1}`)
  }

  // Path B: token-based (different device or expired cookie)
  if (!token || !sid) redirect('/form/1')

  // DB lookup — requires Prisma to be set up
  // For now redirect to step 1 if no DB
  try {
    const { prisma } = await import('@/lib/db')
    const record = await prisma.resumeToken.findUnique({ where: { token } })

    if (!record || record.submissionId !== sid || record.expiresAt < new Date()) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-sm text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⏱</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Link expired</h1>
            <p className="text-gray-500 text-sm mb-6">This link has expired or is invalid. Links are valid for 7 days.</p>
            <a href="/form/1" className="inline-flex items-center justify-center w-full h-12 rounded-full font-bold text-sm uppercase text-gray-900" style={{background:'#11EBF2'}}>Start fresh</a>
          </div>
        </div>
      )
    }

    // Restore session
    const restored = await getIronSession<SessionData>(cookieStore, sessionOptions)
    restored.submissionId    = record.submissionId
    restored.lastStepReached = record.lastStep
    restored.patientEmail    = record.patientEmail ?? undefined
    restored.patientName     = record.patientName ?? undefined
    try { restored.affiliateParams = JSON.parse(record.affiliateSnapshot || '{}') } catch { restored.affiliateParams = {} }
    await restored.save()

    await prisma.resumeToken.update({ where: { token }, data: { usedAt: new Date() } })

    redirect(isDirect ? `/products?sid=${record.submissionId}&direct=1` : `/form/${record.lastStep}`)
  } catch {
    // Prisma not set up yet — fall back gracefully
    redirect('/form/1')
  }
}
