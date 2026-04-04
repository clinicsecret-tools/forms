import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/session'
import { parseAffiliateParams, mergeAffiliateParams } from '@/lib/affiliate'
import type { SessionData } from '@/types'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|api/).*)'],
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const searchParams = req.nextUrl.searchParams
  const hasAffiliate = ['utm_source','utm_medium','oid','affid','gclid','fbclid',
    'tbclid','offer_id','sc_ref','aff_id','sub1'].some(k => searchParams.has(k))

  if (!hasAffiliate) return res

  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions)
    const incoming = parseAffiliateParams(searchParams)
    session.affiliateParams = mergeAffiliateParams(session.affiliateParams ?? {}, incoming)
    await session.save()
  } catch (e) {
    console.error('[middleware] affiliate capture failed', e)
  }

  return res
}
