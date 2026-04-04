'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { PRODUCTS, formatAmount } from '@/lib/products'
import { Spinner } from '@/components/ui'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ── Outer: fetches client secret, mounts Elements ────────────────────────────

export function PaymentForm() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') ?? ''
  const paymentType = (searchParams.get('type') ?? 'one_time') as 'one_time' | 'subscription'

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const product = PRODUCTS.find(p => p.id === productId)

  useEffect(() => {
    if (!productId) return

    fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        paymentType,
        coupon: searchParams.get('coupon') ?? undefined,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setClientSecret(data.clientSecret)
        setAmount(data.amount)
      })
      .catch(() => setError('Failed to initialize payment. Please try again.'))
  }, [productId, paymentType])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#11EBF2',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
          },
        },
      }}
    >
      <CheckoutForm
        product={product}
        amount={amount}
        paymentType={paymentType}
        clientSecret={clientSecret}
      />
    </Elements>
  )
}

// ── Inner: Stripe Elements checkout form ──────────────────────────────────────

interface CheckoutFormProps {
  product: typeof PRODUCTS[number] | undefined
  amount: number
  paymentType: 'one_time' | 'subscription'
  clientSecret: string
}

function CheckoutForm({ product, amount, paymentType }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    setError(null)

    // Build return URL with all affiliate params
    const qs = new URLSearchParams(searchParams.toString())
    const returnUrl = `${window.location.origin}/thank-you?${qs.toString()}`

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed. Please try again.')
      setIsSubmitting(false)
    }
    // On success, Stripe redirects to return_url automatically
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Complete your order</h1>
          <p className="mt-1 text-gray-500 text-sm">
            {product?.name} — {paymentType === 'subscription' ? 'Monthly subscription' : 'One-time purchase'}
          </p>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{product?.name}</p>
              <p className="text-sm text-gray-500">{product?.description}</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatAmount(amount)}</p>
          </div>
          {paymentType === 'subscription' && (
            <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
              Billed monthly. Cancel anytime from your account.
            </p>
          )}
        </div>

        {/* Stripe payment form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <PaymentElement
              options={{
                layout: 'tabs',
                defaultValues: {},
              }}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner /> Processing…
              </span>
            ) : (
              `Pay ${formatAmount(amount)}`
            )}
          </button>
        </form>

        {/* Security footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span>🔒</span>
          <span>Secured by Stripe · Your card info never touches our servers</span>
        </div>
      </div>
    </div>
  )
}
