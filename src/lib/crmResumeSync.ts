/**
 * crmResumeSync.ts
 *
 * Pushes resume_url + product_direct_url to Close.io and GHL.
 * Both platforms can then fire email/SMS automations from those fields.
 *
 * GHL: use a workflow trigger on "Contact Updated" → Custom Field changes →
 *      send the contact their resume_form_url or product_direct_url via email/SMS.
 *
 * Close.io: use a Smart View filtered on cf_abandon_status + a sequence
 *           that sends the resume URL via email or SMS.
 */

interface ResumeSyncPayload {
  email: string
  name?: string
  submissionId: string
  resumeUrl: string       // /resume?token=...  → resumes form at last step
  productUrl: string      // /products?token=... → skips form, direct to purchase
  lastStep: number
  affiliateParams: Record<string, string>
}

export async function pushResumeLinkToCRMs(payload: ResumeSyncPayload): Promise<void> {
  await Promise.allSettled([
    pushToClose(payload),
    pushToGHL(payload),
    pushToInHouse(payload),
  ])
}

// ── Close.io ──────────────────────────────────────────────────────────────────

async function pushToClose(p: ResumeSyncPayload): Promise<void> {
  const apiKey = process.env.CLOSE_API_KEY
  if (!apiKey) return

  const auth = 'Basic ' + Buffer.from(`${apiKey}:`).toString('base64')
  const headers = { Authorization: auth, 'Content-Type': 'application/json' }

  try {
    // Find lead by email
    const searchRes = await fetch(
      `https://api.close.com/api/v1/lead/?query=email:${encodeURIComponent(p.email)}&_fields=id`,
      { headers }
    )
    const searchData = await searchRes.json()
    const leadId: string | undefined = searchData?.data?.[0]?.id

    if (!leadId) {
      console.warn(`[Close] no lead found for ${p.email}`)
      return
    }

    // Determine abandon type for smart view filtering
    const abandonStatus =
      p.lastStep >= 12 ? 'product_abandon'
      : p.lastStep >= 9 ? 'post_email_abandon'
      : 'form_abandon'

    // Update custom fields
    // ⚠ Replace cf_resume_url / cf_product_direct_url with your real Close field IDs
    await fetch(`https://api.close.com/api/v1/lead/${leadId}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        custom: {
          'cf_resume_url': p.resumeUrl,
          'cf_product_direct_url': p.productUrl,
          'cf_last_step_reached': String(p.lastStep),
          'cf_abandon_status': abandonStatus,
          'cf_resume_updated_at': new Date().toISOString(),
        },
      }),
    })

    console.log(`[Close] resume URLs updated for ${p.email} (step ${p.lastStep}, ${abandonStatus})`)
  } catch (err) {
    console.error('[Close] pushResumeLink failed:', err)
  }
}

// ── GoHighLevel ───────────────────────────────────────────────────────────────

async function pushToGHL(p: ResumeSyncPayload): Promise<void> {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID
  if (!apiKey || !locationId) return

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  }

  try {
    // Upsert contact — GHL triggers "Contact Updated" workflow on field change.
    // Create GHL automations:
    //   Trigger: Contact Updated → Field: resume_form_url or product_direct_url
    //   Action:  Send Email / SMS with the link
    //
    // Suggested GHL workflow names:
    //   "Form Abandon — Resume SMS"   → sends resume_form_url via SMS
    //   "Form Abandon — Resume Email" → sends resume_form_url via email
    //   "Product Abandon — Direct SMS" → sends product_direct_url via SMS

    const abandonTag =
      p.lastStep >= 12 ? 'abandoned-product-page'
      : p.lastStep >= 9 ? 'abandoned-after-email'
      : `abandoned-step-${p.lastStep}`

    await fetch('https://rest.gohighlevel.com/v1/contacts/upsert', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: p.email,
        firstName: p.name?.split(' ')[0] ?? '',
        lastName: p.name?.split(' ').slice(1).join(' ') ?? '',
        locationId,
        tags: [abandonTag],
        customField: {
          // ⚠ These keys must match your GHL custom field API keys exactly
          resume_form_url: p.resumeUrl,
          product_direct_url: p.productUrl,
          last_step_reached: String(p.lastStep),
          abandon_type: abandonTag,
          resume_updated_at: new Date().toISOString(),
          submission_id: p.submissionId,
          // Affiliate context — useful for personalising SMS/email copy
          utm_source: p.affiliateParams.utm_source ?? '',
          coupon: p.affiliateParams.coupon ?? '',
        },
      }),
    })

    console.log(`[GHL] resume URLs updated for ${p.email} (${abandonTag})`)
  } catch (err) {
    console.error('[GHL] pushResumeLink failed:', err)
  }
}

// ── In-house CRM / webhook ────────────────────────────────────────────────────

async function pushToInHouse(p: ResumeSyncPayload): Promise<void> {
  const endpoint = process.env.INHOUSE_CRM_WEBHOOK_URL
  if (!endpoint) return

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.INHOUSE_CRM_API_KEY ?? '',
      },
      body: JSON.stringify({ event: 'resume_link_generated', ...p }),
      signal: AbortSignal.timeout(8000),
    })
  } catch (err) {
    console.error('[InHouse] pushResumeLink failed:', err)
  }
}
