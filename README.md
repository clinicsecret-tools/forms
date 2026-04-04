# HIPAA Intake Form — Next.js

A HIPAA-compliant, 12-step patient intake form with server-side affiliate tracking,
multi-CRM integration, and custom Stripe checkout.

## Architecture

```
Landing (URL params captured) → 12-step form → Product selection → Stripe payment → Thank-you
```

Affiliate params are captured once by Next.js middleware on landing,
stored in an encrypted `iron-session` cookie, and passed as URL query params
from the form to the product and payment pages.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Forms | React Hook Form + Zod |
| Session | iron-session (encrypted cookie) |
| State | Zustand |
| Database | PostgreSQL via Prisma |
| Payment | Stripe Elements |
| Styling | Tailwind CSS |

## Setup

### 1. Clone and install
```bash
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
# Fill in all values — see .env.example for descriptions
```

Required before running:
- `SESSION_SECRET` — 32+ char random string
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (from Stripe CLI or dashboard)
- At least one CRM key (`CLOSE_API_KEY` or `GHL_API_KEY`)

### 3. Database
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database (dev)
# or
npm run db:migrate     # Create migration (production)
```

### 4. Stripe webhook (local dev)
```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

### 5. Run
```bash
npm run dev
```

## Key files

```
src/
├── app/
│   ├── api/
│   │   ├── form/step/route.ts          ← Step validation + CRM write
│   │   └── payment/
│   │       ├── create-intent/route.ts  ← Stripe PaymentIntent creation
│   │       └── webhook/route.ts        ← Stripe webhook + postbacks
│   ├── form/[step]/page.tsx            ← Dynamic step pages
│   ├── products/page.tsx               ← Product selection
│   └── payment/page.tsx                ← Stripe checkout
├── lib/
│   ├── affiliate.ts    ← Param parsing, normalization, postbacks
│   ├── crm.ts          ← Close.io, GHL, in-house writes
│   ├── products.ts     ← Product catalog
│   ├── schemas.ts      ← Zod schemas for all 12 steps
│   └── session.ts      ← iron-session config
├── hooks/
│   └── useStepSubmit.ts  ← Step submit hook with navigation
├── store/
│   └── formStore.ts      ← Zustand state (current step, skip logic)
├── types/
│   └── index.ts          ← All TypeScript types
└── middleware.ts          ← Affiliate param capture on landing
```

## Affiliate networks supported

| Network | Detection | Params |
|---|---|---|
| Everflow | `oid` + `affid` present | oid, affid, new_id, transaction_id, sub1-5 |
| Facebook Ads | `affid` contains "facebookads" | affid, sub1-5 |
| Google | `utm_source` contains "google" / "g_ad" | gclid, utm_* |
| Taboola | `utm_source` contains "taboola" | tbclid, utm_* |
| Katalys | `offer_id` + `publisher_id` present | offer_id, publisher_id, placement_id |
| SamCart | `sc_ref` + `sc_vis` present | sc_ref, sc_vis |
| Organic | fallback | utm_source if present |

## Products

Edit `src/lib/products.ts` to set your product names, prices, and Stripe Price IDs.

## Skip logic

- Step 11 (pregnancy question) is skipped for male patients
- Server returns `skipToStep` in the step submit response
- Client Zustand store tracks skipped steps

## Adding a CRM

Add a new function in `src/lib/crm.ts` and call it inside `writeToCRMs()`.
The `CRMPayload` type defines everything available at each step write.
