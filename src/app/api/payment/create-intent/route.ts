import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession } from '@/lib/session'
import type { CreatePaymentIntentRequest, CreatePaymentIntentResponse } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  try {
    const body: CreatePaymentIntentRequest = await req.json()
    const { productId, paymentType, coupon } = body

    // Load session for affiliate context + submission ID
    const session = await getSession()

    if (!session.submissionId) {
      return NextResponse.json(
        { error: 'No active form session found' },
        { status: 400 }
      )
    }

    // Look up product from your config (see lib/products.ts)
    const product = getProductById(productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Apply coupon if provided
    let finalAmount = product.amount
    let stripeCouponId: string | undefined

    if (coupon) {
      try {
        const couponObj = await stripe.coupons.retrieve(coupon)
        if (couponObj.valid) {
          stripeCouponId = couponObj.id
          if (couponObj.amount_off) {
            finalAmount = Math.max(0, finalAmount - couponObj.amount_off)
          } else if (couponObj.percent_off) {
            finalAmount = Math.round(finalAmount * (1 - couponObj.percent_off / 100))
          }
        }
      } catch {
        // Invalid coupon — proceed without discount
        console.warn(`[payment] invalid coupon: ${coupon}`)
      }
    }

    // Get or create Stripe customer
    let customerId = session.stripeCustomerId
    if (!customerId && session.patientEmail) {
      const existing = await stripe.customers.list({
        email: session.patientEmail,
        limit: 1,
      })

      if (existing.data.length > 0) {
        customerId = existing.data[0].id
      } else {
        const [firstName, ...rest] = (session.patientName ?? '').split(' ')
        const customer = await stripe.customers.create({
          email: session.patientEmail,
          name: session.patientName,
          metadata: {
            submission_id: session.submissionId,
            utm_source: session.affiliateParams.utm_source ?? '',
            affid: session.affiliateParams.affid ?? '',
            tracking_unid: session.affiliateParams.tracking_unid ?? '',
          },
        })
        customerId = customer.id
      }

      session.stripeCustomerId = customerId
      session.selectedProductId = productId
      await session.save()
    }

    if (paymentType === 'subscription' && product.stripeRecurringPriceId) {
      // ── Subscription: create SetupIntent then subscription ────────────────
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        metadata: {
          submission_id: session.submissionId,
          product_id: productId,
          price_id: product.stripeRecurringPriceId,
          coupon: stripeCouponId ?? '',
          tracking_unid: session.affiliateParams.tracking_unid ?? '',
          utm_source: session.affiliateParams.utm_source ?? '',
          affid: session.affiliateParams.affid ?? '',
          sub1: session.affiliateParams.sub1 ?? '',
        },
      })

      const response: CreatePaymentIntentResponse = {
        clientSecret: setupIntent.client_secret!,
        amount: finalAmount,
        currency: product.currency,
        paymentIntentId: setupIntent.id,
      }
      return NextResponse.json(response)
    } else {
      // ── One-time payment ──────────────────────────────────────────────────
      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: product.currency,
        customer: customerId,
        automatic_payment_methods: { enabled: true },
        metadata: {
          submission_id: session.submissionId,
          product_id: productId,
          price_id: product.stripePriceId,
          coupon: stripeCouponId ?? '',
          tracking_unid: session.affiliateParams.tracking_unid ?? '',
          utm_source: session.affiliateParams.utm_source ?? '',
          affid: session.affiliateParams.affid ?? '',
          sub1: session.affiliateParams.sub1 ?? '',
          oid: session.affiliateParams.oid ?? '',
          transaction_id: session.affiliateParams.transaction_id ?? '',
        },
      })

      const response: CreatePaymentIntentResponse = {
        clientSecret: paymentIntent.client_secret!,
        amount: finalAmount,
        currency: product.currency,
        paymentIntentId: paymentIntent.id,
      }
      return NextResponse.json(response)
    }
  } catch (err) {
    console.error('[payment/create-intent] error', err)
    return NextResponse.json({ error: 'Payment setup failed' }, { status: 500 })
  }
}

// ─── Product catalog ──────────────────────────────────────────────────────────
// Move this to lib/products.ts and fetch from DB / env for production

import { PRODUCTS } from '@/lib/products'

function getProductById(id: string) {
  return PRODUCTS.find(p => p.id === id) ?? null
}
