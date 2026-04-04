'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PRODUCTS, formatAmount } from '@/lib/products'
import type { Product } from '@/types'
import { Suspense } from 'react'

type PaymentType = 'one_time' | 'subscription'

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedProduct, setSelectedProduct] = useState<string>(PRODUCTS[0]?.id ?? '')
  const [paymentType, setPaymentType] = useState<PaymentType>('one_time')
  const [isLoading, setIsLoading] = useState(false)
  const [patientName, setPatientName] = useState<string>('')

  const isDirect = searchParams.get('direct') === '1'
  const sid = searchParams.get('sid')

  // If direct link — session was already restored by /resume route,
  // try to get patient name from session via a lightweight API call
  useEffect(() => {
    if (isDirect && sid) {
      fetch('/api/session/summary')
        .then(r => r.json())
        .then(data => { if (data.name) setPatientName(data.name) })
        .catch(() => {})
    }
  }, [isDirect, sid])

  const chosen = PRODUCTS.find(p => p.id === selectedProduct) ?? PRODUCTS[0]

  const handleContinue = () => {
    if (!chosen) return
    setIsLoading(true)
    const qs = new URLSearchParams(searchParams.toString())
    qs.set('product', chosen.id)
    qs.set('type', paymentType)
    router.push(`/payment?${qs.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full border border-green-200 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
            Prescription Approved
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {patientName ? `${patientName.split(' ')[0]}, choose your plan` : 'Choose your treatment plan'}
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            {isDirect
              ? 'Your prescription is on file — select a plan to complete your order'
              : 'Select the option that works best for you'}
          </p>
        </div>

        {/* Payment type toggle */}
        {PRODUCTS.some(p => p.stripeRecurringPriceId) && (
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-6">
            {([
              { value: 'one_time' as const, label: 'One-time' },
              { value: 'subscription' as const, label: 'Subscribe & save' },
            ]).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPaymentType(opt.value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  paymentType === opt.value
                    ? 'bg-[#11EBF2] text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
                {opt.value === 'subscription' && (
                  <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Product cards */}
        <div className="space-y-3 mb-6">
          {PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              paymentType={paymentType}
              selected={selectedProduct === product.id}
              onSelect={() => setSelectedProduct(product.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading || !chosen}
          className="btn-primary"
        >
          {isLoading ? 'Loading…' : `Continue — ${formatAmount(getDisplayAmount(chosen, paymentType))}`}
        </button>

        {/* Trust */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          <span>🔒 SSL Secured</span>
          <span>🏥 HIPAA Compliant</span>
          <span>⭐ 5-Star Rated</span>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ProductsContent />
    </Suspense>
  )
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({
  product, paymentType, selected, onSelect,
}: {
  product: Product
  paymentType: PaymentType
  selected: boolean
  onSelect: () => void
}) {
  const isSubscription = paymentType === 'subscription' && !!product.stripeRecurringPriceId
  const displayAmount = getDisplayAmount(product, paymentType)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all relative ${
        selected ? 'border-[#11EBF2] bg-[#11EBF2]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {product.badge && (
        <span className="absolute top-3 right-3 text-xs font-bold bg-[#11EBF2] text-gray-900 px-2.5 py-1 rounded-full">
          {product.badge}
        </span>
      )}
      <div className="flex items-start justify-between pr-20">
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-gray-800' : 'border-gray-300'}`}>
            {selected && <span className="w-2.5 h-2.5 rounded-full bg-gray-800" />}
          </span>
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{product.description}</p>
            {isSubscription && (
              <p className="text-xs text-green-600 font-medium mt-1">Billed monthly · Cancel anytime</p>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-gray-900">{formatAmount(displayAmount)}</p>
          {isSubscription && <p className="text-xs text-gray-400">/month</p>}
        </div>
      </div>
    </button>
  )
}

function getDisplayAmount(product: Product | undefined, paymentType: PaymentType): number {
  if (!product) return 0
  if (paymentType === 'subscription' && product.stripeRecurringPriceId) {
    return Math.round(product.amount * 0.8)
  }
  return product.amount
}
