'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { PRODUCTS, formatAmount } from '@/lib/products'
import type { Product } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({
  product,
  amount,
  originalAmount,
  couponCode,
  couponAmountOff,
}: {
  product: Product
  amount: number
  originalAmount: number
  couponCode?: string
  couponAmountOff?: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsSubmitting(true)
    setErrorMsg('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you`,
      },
    })

    if (error) {
      setErrorMsg(error.message ?? 'Payment failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={S.orderSummary}>
        <span style={S.orderLabel}>Order summary</span>
        <div style={S.orderRow}>
          <span style={S.orderProduct}>{product.name}</span>
          <div style={{ textAlign: 'right' }}>
            {couponAmountOff ? <div style={S.orderStrike}>{formatAmount(originalAmount)}</div> : null}
            <span style={S.orderAmount}>{formatAmount(amount)}</span>
          </div>
        </div>
        {couponCode && couponAmountOff ? (
          <div style={S.couponApplied}>Coupon {couponCode} applied: -{formatAmount(couponAmountOff)}</div>
        ) : null}
      </div>

      <div style={S.paymentSection}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {errorMsg && <div style={S.errorBanner}>{errorMsg}</div>}

      <button type="submit" disabled={!stripe || isSubmitting} style={{ ...S.cta, ...(!stripe || isSubmitting ? S.ctaDisabled : {}) }}>
        {isSubmitting ? 'Processing…' : `Pay ${formatAmount(amount)}`}
      </button>

      <p style={S.secureNote}>🔒 256-bit SSL · Your payment info is never stored on our servers</p>
    </form>
  )
}

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') ?? ''
  const paymentType = (searchParams.get('type') ?? 'one_time') as 'one_time' | 'subscription'

  const [clientSecret, setClientSecret] = useState('')
  const [amount, setAmount] = useState(0)
  const [originalAmount, setOriginalAmount] = useState(0)
  const [couponCode, setCouponCode] = useState(searchParams.get('coupon') ?? '')
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>()
  const [couponFeedback, setCouponFeedback] = useState('')
  const [couponAmountOff, setCouponAmountOff] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const product = useMemo(() => PRODUCTS.find(p => p.id === productId), [productId])

  const loadIntent = async (coupon?: string) => {
    const response = await fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, paymentType, coupon }),
    })

    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }

    setClientSecret(data.clientSecret)
    setAmount(data.amount)
    setOriginalAmount(data.originalAmount)
    setAppliedCoupon(data.couponCode)
    setCouponAmountOff(data.couponAmountOff ?? 0)
  }

  useEffect(() => {
    if (!productId) {
      setIsLoading(false)
      setError('Missing product information. Please return and try again.')
      return
    }

    loadIntent(couponCode || undefined)
      .catch((err: Error) => setError(err.message || 'Failed to initialize payment. Please try again.'))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, paymentType])

  const applyCoupon = async () => {
    setCouponFeedback('')
    if (!couponCode.trim()) {
      setCouponFeedback('Enter a coupon code first.')
      return
    }

    setCouponLoading(true)
    try {
      const validationRes = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() }),
      })
      const validation = await validationRes.json()

      if (!validation.valid) {
        setCouponFeedback(validation.message ?? 'Invalid coupon code.')
        return
      }

      await loadIntent(couponCode.trim())
      setCouponFeedback(validation.message ?? 'Coupon applied.')
      setError('')
    } catch {
      setCouponFeedback('Could not apply coupon. Please try again.')
    } finally {
      setCouponLoading(false)
    }
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#11EBF2',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
        colorDanger: '#dc2626',
        fontFamily: "'DM Sans', sans-serif",
        borderRadius: '8px',
      },
    },
  }

  return (
    <div style={S.shell}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={S.title}>Complete your order</h1>
          <p style={S.subtitle}>Secure payment for {product?.name ?? 'your plan'}</p>
        </div>

        {isLoading && <div style={S.loadingCard}><p>Setting up secure checkout…</p></div>}
        {error && <div style={S.errorBanner}>{error}</div>}

        {!isLoading && !error && product && (
          <div style={S.card}>
            <div style={S.couponRow}>
              <input
                style={S.couponInput}
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
              />
              <button style={S.couponButton} type="button" onClick={applyCoupon} disabled={couponLoading}>
                {couponLoading ? 'Applying…' : 'Apply'}
              </button>
            </div>
            {couponFeedback ? <p style={S.couponFeedback}>{couponFeedback}</p> : null}

            {clientSecret ? (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CheckoutForm
                  product={product}
                  amount={amount}
                  originalAmount={originalAmount}
                  couponCode={appliedCoupon}
                  couponAmountOff={couponAmountOff}
                />
              </Elements>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>Loading checkout…</div>}>
      <PaymentPageContent />
    </Suspense>
  )
}

const S: Record<string, React.CSSProperties> = {
  shell: { minHeight: '100vh', background: '#f8f9fb', display: 'flex', justifyContent: 'center', padding: '40px 16px 80px' },
  container: { width: '100%', maxWidth: 540 },
  title: { fontFamily: "'Fraunces',serif", fontSize: '1.8rem', fontWeight: 500, color: '#1a1a1a', marginBottom: 6 },
  subtitle: { fontSize: '0.9rem', color: '#6b6b6b' },
  card: { background: '#fff', border: '1px solid #e6e8ec', borderRadius: 20, padding: '24px' },
  loadingCard: { background: '#fff', border: '1px solid #e6e8ec', borderRadius: 20, padding: '32px', textAlign: 'center' },
  orderSummary: { background: '#f8f9fb', border: '1px solid #e6e8ec', borderRadius: 10, padding: '14px 16px', marginBottom: 24 },
  orderLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 10 },
  orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orderProduct: { fontSize: '0.95rem', fontWeight: 500, color: '#1a1a1a' },
  orderAmount: { fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' },
  orderStrike: { fontSize: '0.8rem', textDecoration: 'line-through', color: '#8a8a8a' },
  couponApplied: { marginTop: 10, color: '#047857', fontSize: '0.8rem' },
  paymentSection: { marginBottom: 20 },
  errorBanner: { background: '#fef2f2', border: '1px solid #dc2626', borderRadius: 8, padding: '12px 16px', fontSize: '0.875rem', color: '#dc2626', marginBottom: 16 },
  cta: { width: '100%', height: 52, background: '#11EBF2', border: 'none', borderRadius: 9999, fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#1a1a1a', cursor: 'pointer', transition: 'background 0.15s', marginTop: 8, marginBottom: 12 },
  ctaDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  secureNote: { textAlign: 'center', fontSize: '0.75rem', color: '#9e9e9e' },
  couponRow: { display: 'flex', gap: 8, marginBottom: 8 },
  couponInput: { flex: 1, border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px', fontSize: '0.9rem' },
  couponButton: { border: 'none', borderRadius: 8, background: '#111827', color: '#fff', padding: '0 14px', fontSize: '0.85rem', cursor: 'pointer' },
  couponFeedback: { fontSize: '0.8rem', color: '#4b5563', marginBottom: 14 },
}
