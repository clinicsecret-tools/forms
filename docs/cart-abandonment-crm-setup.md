# Cart Abandonment — CRM Setup Guide

## How it works

The form generates a **resume token** at two key moments:

1. **Step 9** (email captured) — starts mid-form abandonment window
2. **Step 12** (form submitted) — starts product/payment abandonment window

The `resume_url` field is written to your CRM contact record at each of these steps.
Your CRM automation sequences use this URL in emails/SMS.

---

## Resume URL format

```
https://yoursite.com/resume?t=eyJzdWJtaXNzaW9uSWQiOiJ...
```

The token is signed (HMAC-SHA256) and expires in **7 days**.
It contains: submission ID, email, last step, form completion flag, affiliate params.

When clicked:
- **Mid-form abandonment** → restores session, redirects to `/form/{lastStep}`
- **Product/payment abandonment** → restores session, redirects to `/products?sid=...`

---

## Close.io Setup

### Custom fields to create in Close:
| Field name | Type | Notes |
|---|---|---|
| `resume_url` | URL | Set at step 9 and step 12 |
| `last_step_reached` | Number | Updated on every step |
| `form_complete` | Checkbox | Set true when step 12 submitted |
| `utm_source` | Text | Affiliate source |
| `tracking_unid` | Text | Unique session ID |

### Automation sequence (example):
1. Lead enters → contact created/updated with `resume_url`
2. Wait 2 hours after step 9, check if `form_complete = false`
3. Send email: "You left something behind — your prescription is waiting"
4. Include `{{resume_url}}` in email body
5. Wait 24 hours → SMS: "Quick reminder: {{resume_url}}"
6. Wait 48 hours → final follow-up

### For product/payment abandonment (step 12 complete):
1. When `form_complete = true` → different sequence fires
2. Wait 1 hour after step 12, check if `order_status != paid`
3. Send email: "Your prescription is approved — select your treatment"
4. `resume_url` links directly to `/products` (skips form entirely)

---

## GoHighLevel Setup

### Workflow trigger:
- Tag: `intake-step-9` → trigger abandonment workflow
- Tag: `intake-step-12` → trigger product selection workflow

### Custom values to use in GHL messages:
```
{{contact.resume_url}}
{{contact.last_step_reached}}
```

### GHL Smart List for re-targeting:
- Filter: `form_complete = true` AND `order_status = pending`
- These are your warmest leads — completed the full intake but haven't purchased
- Use with Facebook Custom Audiences or Google Customer Match

---

## In-house CRM

The webhook receives a `resume_url` field in the `stepData` object
at steps 9 and 12. Store it against the contact/lead record and use it
in your own email/SMS trigger logic.

```json
{
  "event": "intake_step_submitted",
  "submissionId": "uuid",
  "step": 9,
  "email": "patient@example.com",
  "stepData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "patient@example.com",
    "resume_url": "https://yoursite.com/resume?t=..."
  }
}
```

---

## Same-device resume (no link needed)

If the patient returns to `yoursite.com/form` on the same browser
**without** clicking a resume link, the middleware automatically detects
their session cookie and redirects them to their last step.

This requires no CRM setup — it's fully automatic.

---

## Token security

- Tokens are signed with `RESUME_TOKEN_SECRET` (HMAC-SHA256)
- They expire after 7 days
- They are single-use in the sense that the session is restored on first click
- If a token is tampered with, verification fails and the patient is sent to step 1

---

## Generating a resume link manually (for CRM-triggered flows)

Your CRM can request a fresh resume link for any submission:

```
GET /api/resume/generate?submissionId=UUID&secret=CRM_WEBHOOK_SECRET
```

Returns:
```json
{
  "ok": true,
  "resumeUrl": "https://yoursite.com/resume?t=...",
  "expiresInDays": 7
}
```

Set `CRM_WEBHOOK_SECRET` in your `.env.local` to the same value configured in your CRM.
