import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession } from '@/lib/session'
import { getProductById } from '@/lib/products'
import { validateCoupon } from '@/lib/coupons'
import type { CreatePaymentIntentRequest, CreatePaymentIntentResponse } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body: CreatePaymentIntentRequest = await req.json()
    const { productId, paymentType, coupon } = body

    const session = await getSession()

    if (!session.submissionId) {
      return NextResponse.json(
        { error: 'No active form session found' },
        { status: 400 }
      )
    }

    const product = getProductById(productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const couponResult = await validateCoupon(coupon)
    const couponAmountOff = couponResult.valid ? couponResult.amountOff : 0
    const finalAmount = Math.max(0, product.amount - couponAmountOff)

    let customerId = session.stripeCustomerId
    if (!customerId && session.patientEmail) {
      const existing = await stripe.customers.list({
        email: session.patientEmail,
        limit: 1,
      })

      if (existing.data.length > 0) {
        customerId = existing.data[0].id
      } else {
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: product.currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      metadata: {
        submission_id: session.submissionId,
        product_id: productId,
        price_id: paymentType === 'subscription'
          ? product.stripeRecurringPriceId ?? ''
          : product.stripePriceId,
        payment_type: paymentType,
        original_amount: String(product.amount),
        coupon: couponResult.valid ? couponResult.code : '',
        coupon_amount_off: String(couponAmountOff),
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
      originalAmount: product.amount,
      currency: product.currency,
      paymentIntentId: paymentIntent.id,
      couponCode: couponResult.valid ? couponResult.code : undefined,
      couponAmountOff,
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error('[payment/create-intent] error', err)
    return NextResponse.json({ error: 'Payment setup failed' }, { status: 500 })
  }
}
