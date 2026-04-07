import type { CRMPayload } from '@/types'

export async function writeToCRMs(payload: CRMPayload): Promise<void> {
  await Promise.allSettled([
    writeToClose(payload),
    writeToGHL(payload),
    writeToInHouse(payload),
  ])
}

async function writeToClose(payload: CRMPayload): Promise<void> {
  const apiKey = process.env.CLOSE_API_KEY
  if (!apiKey) return
  const auth = 'Basic ' + Buffer.from(`${apiKey}:`).toString('base64')
  const headers = { Authorization: auth, 'Content-Type': 'application/json' }
  try {
    const searchRes = await fetch(
      `https://api.close.com/api/v1/lead/?query=email:${encodeURIComponent(payload.email ?? '')}&_fields=id`,
      { headers }
    )
    const searchData = await searchRes.json()
    const leadId: string | undefined = searchData?.data?.[0]?.id

    const body = {
      name: [payload.firstName, payload.lastName].filter(Boolean).join(' ') || `Intake ${payload.submissionId}`,
      contacts: payload.email ? [{ emails: [{ email: payload.email, type: 'office' }] }] : undefined,
      custom: {
        cf_submission_id:   payload.submissionId,
        cf_last_step:       payload.step,
        cf_utm_source:      payload.affiliateParams.utm_source,
        cf_utm_campaign:    payload.affiliateParams.utm_campaign,
        cf_affiliate_id:    payload.affiliateParams.affid ?? payload.affiliateParams.aff_id,
        cf_sub1:            payload.affiliateParams.sub1,
        cf_coupon:          payload.affiliateParams.coupon,
        cf_tracking_unid:   payload.affiliateParams.tracking_unid,
      },
    }

    if (leadId) {
      await fetch(`https://api.close.com/api/v1/lead/${leadId}/`, { method: 'PUT', headers, body: JSON.stringify(body) })
    } else {
      await fetch('https://api.close.com/api/v1/lead/', { method: 'POST', headers, body: JSON.stringify(body) })
    }
  } catch (err) {
    console.error('[Close]', err)
  }
}

async function writeToGHL(payload: CRMPayload): Promise<void> {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID
  if (!apiKey || !locationId) return
  try {
    await fetch('https://rest.gohighlevel.com/v1/contacts/upsert', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Version: '2021-07-28' },
      body: JSON.stringify({
        firstName: payload.firstName ?? '',
        lastName:  payload.lastName ?? '',
        email:     payload.email ?? '',
        locationId,
        tags: [`intake-step-${payload.step}`, payload.affiliateParams.utm_source ? `src-${payload.affiliateParams.utm_source}` : 'src-organic'].filter(Boolean),
        customField: {
          submission_id:   payload.submissionId,
          last_step:       payload.step,
          utm_source:      payload.affiliateParams.utm_source,
          utm_campaign:    payload.affiliateParams.utm_campaign,
          affiliate_id:    payload.affiliateParams.affid ?? payload.affiliateParams.aff_id,
          sub1:            payload.affiliateParams.sub1,
          tracking_unid:   payload.affiliateParams.tracking_unid,
          coupon:          payload.affiliateParams.coupon,
        },
      }),
    })
  } catch (err) {
    console.error('[GHL]', err)
  }
}

async function writeToInHouse(payload: CRMPayload): Promise<void> {
  const endpoint = process.env.INHOUSE_CRM_WEBHOOK_URL
  if (!endpoint) return
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': process.env.INHOUSE_CRM_API_KEY ?? '' },
      body: JSON.stringify({ event: 'intake_step_submitted', ...payload }),
      signal: AbortSignal.timeout(8000),
    })
  } catch (err) {
    console.error('[InHouse]', err)
  }
}
