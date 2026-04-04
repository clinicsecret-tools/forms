import type { AffiliateParams, AffiliateSource } from '@/types'

// ─── All URL params we capture ───────────────────────────────────────────────

const AFFILIATE_PARAM_KEYS: (keyof AffiliateParams)[] = [
  // UTM
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_adgroup',
  // Everflow
  'oid', 'affid', 'new_id', 'transaction_id', 'ef_transaction_id', 'creative_id', 'source_id',
  // Katalys
  'offer_id', 'publisher_id', 'placement_id',
  // Sub-IDs
  'sub1', 'sub2', 'sub3', 'sub4', 'sub5',
  // Click IDs
  'gclid', 'fbclid', 'tbclid', 'ttclid', 'msclkid', 'click_id',
  // SamCart / custom
  'sc_ref', 'sc_vis', 'aff_id', 'cs_campaign', 'cs_page',
  // Business
  'coupon', 'promo', 'intake_class', 'domain', 'caller_page', 'order_id', 'csioid',
]

// ─── Parse params from URL search string ─────────────────────────────────────

export function parseAffiliateParams(searchParams: URLSearchParams): AffiliateParams {
  const params: AffiliateParams = {}

  for (const key of AFFILIATE_PARAM_KEYS) {
    const val = searchParams.get(key)
    if (val) {
      (params as Record<string, string>)[key] = val
    }
  }

  params.resolvedSource = resolveSource(params)
  params.tracking_unid = params.tracking_unid ?? generateTrackingId()

  return params
}

// ─── Resolve which affiliate network this traffic is from ────────────────────
// Mirrors your JotForm conditions but cleanly server-side

export function resolveSource(p: AffiliateParams): AffiliateSource {
  // CX Referral (SamCart internal)
  if (p.sc_ref && p.sc_vis) return 'samcart'

  // Facebook Ads — affid contains "facebookads"
  if (p.affid?.toLowerCase().includes('facebookads')) return 'facebook'

  // Everflow — has oid + affid
  if (p.oid && p.affid) return 'everflow'

  // Katalys — has offer_id + publisher_id
  if (p.offer_id && p.publisher_id) return 'katalys'

  // Google — utm_source contains google or g_ad
  const src = p.utm_source?.toLowerCase() ?? ''
  if (src.includes('google') || src.includes('g_ad')) return 'google'

  // Taboola
  if (src.includes('taboola')) return 'taboola'

  // Generic affiliate with utm_source
  if (src) return 'organic'

  return 'organic'
}

// ─── Build postback URL for each network after confirmed payment ──────────────

export function buildPostbackUrl(
  params: AffiliateParams,
  orderId: string,
  amount: number
): string | null {
  const source = params.resolvedSource ?? resolveSource(params)

  switch (source) {
    case 'everflow': {
      if (!params.transaction_id && !params.ef_transaction_id) return null
      const tid = params.transaction_id ?? params.ef_transaction_id
      const base = process.env.EVERFLOW_POSTBACK_URL
      if (!base) return null
      return `${base}?transaction_id=${tid}&amount=${amount / 100}&order_id=${orderId}`
    }

    case 'katalys': {
      const base = process.env.KATALYS_POSTBACK_URL
      if (!base || !params.offer_id) return null
      return `${base}?offer_id=${params.offer_id}&publisher_id=${params.publisher_id ?? ''}&order_id=${orderId}&amount=${amount / 100}`
    }

    case 'google': {
      // Google conversion is typically done via gtag on the client
      // Return null here; fire via gtag on thank-you page
      return null
    }

    case 'taboola': {
      const base = process.env.TABOOLA_POSTBACK_URL
      if (!base || !params.tbclid) return null
      return `${base}?click_id=${params.tbclid}&revenue=${amount / 100}&order_id=${orderId}`
    }

    case 'facebook': {
      // Facebook conversions API is fired server-side separately
      return null
    }

    case 'samcart':
    case 'organic':
    default:
      return null
  }
}

// ─── Fire postback (server-side, fire-and-forget) ────────────────────────────

export async function firePostback(
  params: AffiliateParams,
  orderId: string,
  amount: number
): Promise<void> {
  const url = buildPostbackUrl(params, orderId, amount)
  if (!url) return

  try {
    await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000) })
    console.log(`[postback] fired for source=${params.resolvedSource} order=${orderId}`)
  } catch (err) {
    // Non-blocking — log but don't fail the order
    console.error(`[postback] failed for source=${params.resolvedSource}`, err)
  }
}

// ─── Serialize params to URL query string (for passing through funnel) ────────

export function serializeAffiliateParams(params: AffiliateParams): string {
  const qs = new URLSearchParams()
  for (const key of AFFILIATE_PARAM_KEYS) {
    const val = (params as Record<string, string | undefined>)[key]
    if (val) qs.set(key, val)
  }
  // Always carry tracking_unid
  if (params.tracking_unid) qs.set('tracking_unid', params.tracking_unid)
  return qs.toString()
}

// ─── Merge incoming params with existing session params ───────────────────────
// Incoming URL params take precedence over session (refresh scenario)

export function mergeAffiliateParams(
  existing: AffiliateParams,
  incoming: AffiliateParams
): AffiliateParams {
  const merged = { ...existing }
  for (const key of AFFILIATE_PARAM_KEYS) {
    const val = (incoming as Record<string, string | undefined>)[key]
    if (val) (merged as Record<string, string>)[key] = val
  }
  merged.resolvedSource = resolveSource(merged)
  return merged
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateTrackingId(): string {
  return 'cs_' + Math.random().toString(36).slice(2, 14).padEnd(12, '0')
}

export function calculateAge(dobMonth: string, dobDay: string, dobYear: string): number {
  const dob = new Date(
    parseInt(dobYear),
    parseInt(dobMonth) - 1,
    parseInt(dobDay)
  )
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}
