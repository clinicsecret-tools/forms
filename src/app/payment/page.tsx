'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { PRODUCTS, formatAmount } from '@/lib/products'
import type { Product } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ product, amount }: { product: Product; amount: number }) {
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
          <span style={S.orderAmount}>{formatAmount(amount)}</span>
        </div>
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
  const productId = searchParams.get('productId') ?? ''
  const paymentType = (searchParams.get('paymentType') ?? 'one_time') as 'one_time' | 'subscription'

  const [clientSecret, setClientSecret] = useState('')
  const [amount, setAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const product = PRODUCTS.find(p => p.id === productId)

  useEffect(() => {
    if (!productId) {
      setIsLoading(false)
      setError('Missing product information. Please return and try again.')
      return
    }

    fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, paymentType }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }
        setClientSecret(data.clientSecret)
        setAmount(data.amount)
      })
      .catch(() => setError('Failed to initialize payment. Please try again.'))
      .finally(() => setIsLoading(false))
  }, [productId, paymentType])

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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={S.title}>Complete your order</h1>
          <p style={S.subtitle}>Secure payment · Cancel anytime</p>
        </div>

        {isLoading && (
          <div style={S.loadingCard}>
            <div style={S.spinner} />
            <p style={{ color: '#6b6b6b', marginTop: 16 }}>Setting up secure checkout…</p>
          </div>
        )}

        {error && <div style={S.errorBanner}>{error}</div>}

        {!isLoading && !error && clientSecret && product && (
          <div style={S.card}>
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm product={product} amount={amount} />
            </Elements>
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
  container: { width: '100%', maxWidth: 520 },
  title: { fontFamily: "'Fraunces',serif", fontSize: '1.8rem', fontWeight: 500, color: '#1a1a1a', marginBottom: 6 },
  subtitle: { fontSize: '0.9rem', color: '#6b6b6b' },
  card: { background: '#fff', border: '1px solid #e6e8ec', borderRadius: 20, padding: '32px 28px' },
  loadingCard: { background: '#fff', border: '1px solid #e6e8ec', borderRadius: 20, padding: '60px 28px', textAlign: 'center' },
  spinner: { width: 36, height: 36, border: '3px solid #e6e8ec', borderTop: '3px solid #11EBF2', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' },
  orderSummary: { background: '#f8f9fb', border: '1px solid #e6e8ec', borderRadius: 10, padding: '14px 16px', marginBottom: 24 },
  orderLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 10 },
  orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orderProduct: { fontSize: '0.95rem', fontWeight: 500, color: '#1a1a1a' },
  orderAmount: { fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' },
  paymentSection: { marginBottom: 20 },
  errorBanner: { background: '#fef2f2', border: '1px solid #dc2626', borderRadius: 8, padding: '12px 16px', fontSize: '0.875rem', color: '#dc2626', marginBottom: 16 },
  cta: { width: '100%', height: 52, background: '#11EBF2', border: 'none', borderRadius: 9999, fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#1a1a1a', cursor: 'pointer', transition: 'background 0.15s', marginTop: 8, marginBottom: 12 },
  ctaDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  secureNote: { textAlign: 'center', fontSize: '0.75rem', color: '#9e9e9e' },
}
