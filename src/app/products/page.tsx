'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PRODUCTS, formatAmount } from '@/lib/products'
import type { Product } from '@/types'

type PaymentType = 'one_time' | 'subscription'

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [paymentType] = useState<PaymentType>('subscription')
  const [isLoading, setIsLoading] = useState(false)
  const [patientName, setPatientName] = useState<string>('')
  const [painLevel, setPainLevel] = useState<number>(10)
  const [showPlans, setShowPlans] = useState(false)

  const isDirect = searchParams.get('direct') === '1'
  const sid = searchParams.get('sid')

  useEffect(() => {
    const painFromUrl = Number.parseInt(searchParams.get('pl') ?? '', 10)
    if (Number.isFinite(painFromUrl)) {
      setPainLevel(Math.max(1, Math.min(10, painFromUrl)))
    }
  }, [searchParams])

  // If direct link — session was already restored by /resume route,
  // get customer details for personalization.
  useEffect(() => {
    if (isDirect && sid) {
      fetch('/api/session/summary')
        .then(r => r.json())
        .then(data => {
          if (data.name) setPatientName(data.name)
          if (typeof data.painLevel === 'number') {
            setPainLevel(Math.max(1, Math.min(10, data.painLevel)))
          }
        })
        .catch(() => {})
    }
  }, [isDirect, sid])

  const handleContinue = (productId: string) => {
    setIsLoading(true)
    const qs = new URLSearchParams(searchParams.toString())
    qs.set('product', productId)
    qs.set('type', paymentType)
    qs.set('pl', String(painLevel))
    router.push(`/payment?${qs.toString()}`)
  }

  const firstName = useMemo(() => patientName.split(' ')[0] || 'you', [patientName])

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {patientName ? `${firstName}, your prescription is approved` : 'Your prescription is approved'}
          </h1>
          <p className="mt-2 text-gray-600">Pick your plan and start reducing pain now.</p>
        </div>

        <PainChart painLevel={painLevel} customerName={firstName} />

        <BonusSection
          title="Included Bonus #1"
          subtitle="Pain Relief Solution Guide"
          bullets={[
            '5 common mistakes to avoid on Pentadeca Arginate (PDA+).',
            'How to maximize your healing results on Pentadeca Arginate (PDA+).',
            'Common body toxins that cause inflammation and how to clear them.',
            'Stretching & therapeutic movements to do at home.',
          ]}
          imageUrl="https://i0.wp.com/clinicsecret.com/wp-content/uploads/2026/01/clinic-secret.png?w=2000&ssl=1"
          imageAlt="Pain Relief Solution Guide"
          imageSide="right"
        />

        <BonusSection
          title="Included Bonus #2"
          subtitle="Welcome Kit (shipped in private box)"
          bullets={[
            'Muscle & joint rollers.',
            'Clinic Secret reusable cold/warm pack.',
            'Members Only Bottle.',
            'Surprise gear and goodies.',
          ]}
          imageUrl="https://i0.wp.com/clinicsecret.com/wp-content/uploads/2026/01/Add-a-subheading-4.png?w=1794&ssl=1"
          imageAlt="Welcome kit"
          imageSide="left"
        />

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowPlans(true)}
            className="bg-[#17dce4] text-[#081222] font-bold tracking-wide rounded-full px-10 py-4 text-xl hover:brightness-95 transition"
          >
            SELECT YOUR PLAN
          </button>
        </div>

        {showPlans && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <p className="text-lg font-semibold text-gray-900 mb-3">Also included</p>
              <ul className="grid sm:grid-cols-2 gap-2 text-gray-700">
                <li>• Unlimited doctor check-ins</li>
                <li>• All supplies needed</li>
                <li>• Free 2 day shipping</li>
                <li>• Pain relief guarantee</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRODUCTS.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  paymentType={paymentType}
                  onStart={() => handleContinue(product.id)}
                  disabled={isLoading}
                />
              ))}
            </div>
          </>
        )}
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

function PainChart({ painLevel, customerName }: { painLevel: number, customerName: string }) {
  const weeks = 3
  const startX = 60
  const startY = 80
  const endX = 540
  const endY = 280
  const axisY = 320

  return (
    <section id="pain-chart" className="w-full max-w-[620px] mx-auto rounded-xl px-5 font-sans">
      <p className="text-2xl mb-4 text-center text-gray-900">
        {customerName}, we can help reduce your pain from <b>{painLevel}</b> to <b>0</b> in <b>{weeks} weeks</b>
      </p>
      <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <svg viewBox="0 0 600 365" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <defs>
            <linearGradient id="painGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="red" />
              <stop offset="100%" stopColor="#02f5ff" />
            </linearGradient>
          </defs>

          <line x1={startX} y1="40" x2={startX} y2={axisY} stroke="#000" strokeWidth="1" />
          <line x1={startX} y1={axisY} x2={endX} y2={axisY} stroke="#000" strokeWidth="1" />

          <path
            d={`M${startX},${startY} C200,260 400,300 ${endX},${endY}`}
            stroke="url(#painGradient)"
            strokeWidth="4"
            fill="transparent"
            style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
          />

          <text x="25" y="82" style={{ fontSize: '64px' }}>😣</text>
          <text x="520" y="298" style={{ fontSize: '64px' }}>🙂</text>

          <foreignObject x={startX - 40} y={axisY + 5} width="100" height="40">
            <div className="bg-white border-2 border-black rounded-md px-2 py-1 text-center"><strong>Start</strong></div>
          </foreignObject>

          <foreignObject x={endX - 70} y={axisY + 5} width="120" height="40">
            <div className="bg-[#02f5ff] border-2 border-[#02f5ff] rounded-md px-2 py-1 text-center"><strong>{weeks} Weeks</strong></div>
          </foreignObject>
        </svg>
      </div>
    </section>
  )
}

function BonusSection({
  title,
  subtitle,
  bullets,
  imageUrl,
  imageAlt,
  imageSide,
}: {
  title: string
  subtitle: string
  bullets: string[]
  imageUrl: string
  imageAlt: string
  imageSide: 'left' | 'right'
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className={`grid md:grid-cols-[1fr_220px] items-center gap-6 ${imageSide === 'left' ? 'md:grid-cols-[220px_1fr]' : ''}`}>
        {imageSide === 'left' && (
          <img src={imageUrl} alt={imageAlt} className="w-full max-w-[220px] mx-auto h-auto" />
        )}

        <div>
          <p className="text-sm uppercase font-semibold text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{subtitle}</h3>
          <ul className="mt-4 space-y-2 text-gray-700">
            {bullets.map(item => <li key={item}>• {item}</li>)}
          </ul>
        </div>

        {imageSide === 'right' && (
          <img src={imageUrl} alt={imageAlt} className="w-full max-w-[220px] mx-auto h-auto" />
        )}
      </div>
    </section>
  )
}

function ProductCard({
  product,
  paymentType,
  onStart,
  disabled,
}: {
  product: Product
  paymentType: PaymentType
  onStart: () => void
  disabled: boolean
}) {
  const displayAmount = getDisplayAmount(product, paymentType)
  const discountedAmount = Math.max(0, displayAmount - 10000)
  const planLabel = product.id.includes('3mo') ? '3 Month Plan' : 'Monthly Plan'
  const vialImage = product.id.includes('3mo')
    ? 'https://clinicsecret.com/wp-content/uploads/2026/01/3-Month-New-Vials-2.svg'
    : 'https://clinicsecret.com/wp-content/uploads/2026/01/Untitled-design-2.svg'

  return (
    <div className="w-full text-left p-7 rounded-3xl border-2 bg-[#f7f7f7] border-[#dddddd] min-h-[420px]">
      <div className="flex h-full flex-col">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-4xl leading-tight tracking-tight font-semibold text-[#2f3238]">
              Pentadeca<br />Arginate
            </p>
            <p className="text-3xl text-[#2f3238] mt-6">{planLabel}</p>
            <p className="text-2xl text-[#2f3238] mt-2">$100 Off 1st Month</p>
            <p className="text-5xl leading-none mt-6 text-[#2f3238]/75 line-through">
              {formatAmount(displayAmount)}
            </p>
            <p className="text-6xl leading-none mt-2 font-medium text-[#2f3238]">
              {formatAmount(discountedAmount)}
            </p>
          </div>
          <img src={vialImage} alt={`${planLabel} vial`} className="w-[160px] h-auto hidden md:block self-end" />
        </div>

        <button
          type="button"
          onClick={onStart}
          disabled={disabled}
          className="mt-auto w-full bg-[#17dce4] text-[#081222] font-bold tracking-wide rounded-full py-4 text-2xl hover:brightness-95 transition disabled:opacity-70"
        >
          {disabled ? 'LOADING…' : 'START PLAN'}
        </button>
      </div>
    </div>
  )
}

function getDisplayAmount(product: Product | undefined, paymentType: PaymentType): number {
  if (!product) return 0
  if (paymentType === 'subscription' && product.stripeRecurringPriceId) {
    return product.amount
  }
  return product.amount
}
