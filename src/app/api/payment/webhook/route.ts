import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { firePostback } from '@/lib/affiliate'
import { writeToCRMs } from '@/lib/crm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(pi)
        break
      }

      case 'customer.subscription.created':
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.payment_intent) {
          const pi = await stripe.paymentIntents.retrieve(
            invoice.payment_intent as string
          )
          await handlePaymentSuccess(pi)
        }
        break
      }

      default:
        // Ignore other events
        break
    }
  } catch (err) {
    console.error(`[webhook] handler error for ${event.type}`, err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSuccess(pi: Stripe.PaymentIntent) {
  const meta = pi.metadata
  const submissionId = meta.submission_id
  const amount = pi.amount

  console.log(`[webhook] payment_intent.succeeded id=${pi.id} sub=${submissionId}`)

  // Reconstruct affiliate params from Stripe metadata
  const affiliateParams = {
    utm_source: meta.utm_source,
    affid: meta.affid,
    oid: meta.oid,
    sub1: meta.sub1,
    transaction_id: meta.transaction_id,
    tracking_unid: meta.tracking_unid,
  }

  // 1. Fire affiliate postback
  await firePostback(affiliateParams, pi.id, amount)

  // 2. Update CRM — mark as won/purchased
  await writeToCRMs({
    submissionId,
    step: 99, // sentinel for "order confirmed"
    affiliateParams,
    stepData: {
      stripe_payment_intent: pi.id,
      amount_paid: amount / 100,
      currency: pi.currency,
      product_id: meta.product_id,
    },
    timestamp: new Date().toISOString(),
  })
}
