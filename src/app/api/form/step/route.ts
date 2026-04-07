import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { STEP_SCHEMAS } from '@/lib/schemas'
import type { Step3Data, Step9Data, Step13Data } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { step, data, submissionId: clientId } = body

    const n = Number(step)
    if (n < 1 || n > 13) return err('Invalid step', 400)

    const schema = STEP_SCHEMAS[n as keyof typeof STEP_SCHEMAS]
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0].message }, { status: 422 })
    }

    const session = await getSession()
    const submissionId = session.submissionId ?? clientId ?? crypto.randomUUID()

    // Capture patient identity at step 9
    if (n === 9) {
      const d = parsed.data as Step9Data
      session.patientEmail = d.email
      session.patientName  = `${d.firstName} ${d.lastName}`
    }

    session.submissionId    = submissionId
    session.lastStepReached = Math.max(session.lastStepReached ?? 0, n)
    await session.save()

    // Step 3: male skips step 11
    if (n === 3) {
      const d = parsed.data as Step3Data
      if (d.gender === 'male') {
        return NextResponse.json({ ok: true, submissionId, nextStep: 4, skipToStep: 11 })
      }
    }

    // Step 13 (final): redirect to products
    if (n === 13) {
      const aff = session.affiliateParams ?? {}
      const qs  = new URLSearchParams()
      qs.set('sid', submissionId)
      const keys = ['utm_source','utm_medium','utm_campaign','utm_content','affid','oid',
        'sub1','sub2','sub3','sub4','sub5','gclid','fbclid','tbclid','coupon','promo',
        'tracking_unid','offer_id','publisher_id','aff_id','new_id','transaction_id']
      for (const k of keys) {
        const v = (aff as Record<string,string>)[k]
        if (v) qs.set(k, v)
      }
      // Fire CRM writes non-blocking
      fireCRM(session, n, parsed.data as Record<string,unknown>)
      return NextResponse.json({ ok: true, submissionId, redirectTo: `/products?${qs}` })
    }

    // Fire CRM writes from step 9+
    if (n >= 9) fireCRM(session, n, parsed.data as Record<string,unknown>)

    return NextResponse.json({ ok: true, submissionId, nextStep: n + 1 })
  } catch (e) {
    console.error('[step]', e)
    return err('Server error', 500)
  }
}

function err(msg: string, status: number) {
  return NextResponse.json({ ok: false, error: msg }, { status })
}

function fireCRM(session: Awaited<ReturnType<typeof getSession>>, step: number, data: Record<string,unknown>) {
  import('@/lib/crm').then(({ writeToCRMs }) =>
    writeToCRMs({
      submissionId: session.submissionId!,
      step,
      firstName: session.patientName?.split(' ')[0],
      lastName:  session.patientName?.split(' ').slice(1).join(' '),
      email:     session.patientEmail,
      affiliateParams: session.affiliateParams ?? {},
      stepData:  data,
      timestamp: new Date().toISOString(),
    })
  ).catch(e => console.error('[crm]', e))
}
