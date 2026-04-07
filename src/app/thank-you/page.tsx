'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const paymentIntent = searchParams.get('payment_intent')

  return (
    <div style={S.shell}>
      <div style={S.card}>
        <div style={S.iconWrap}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#11EBF2" opacity="0.15" />
            <circle cx="24" cy="24" r="18" fill="#11EBF2" />
            <polyline points="14,24 21,31 34,18" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h1 style={S.title}>Order confirmed!</h1>
        <p style={S.body}>
          Thank you for your order. Our licensed physicians are reviewing your
          intake information and will have your prescription ready shortly.
        </p>
        <p style={S.body}>
          You'll receive a confirmation email with your order details and
          next steps. If you have any questions, our support team is here to help.
        </p>
        {paymentIntent && (
          <p style={S.refId}>Reference: {paymentIntent.slice(-12).toUpperCase()}</p>
        )}
        <div style={S.steps}>
          {[
            { n: '1', t: 'Prescription review', d: 'Physician reviews your intake (24–48 hrs)' },
            { n: '2', t: 'Pharmacy processing', d: 'Your medication is prepared and dispensed' },
            { n: '3', t: 'Delivery', d: 'Shipped directly to your door' },
          ].map(s => (
            <div key={s.n} style={S.step}>
              <div style={S.stepN}>{s.n}</div>
              <div>
                <div style={S.stepTitle}>{s.t}</div>
                <div style={S.stepDesc}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>Loading confirmation…</div>}>
      <ThankYouContent />
    </Suspense>
  )
}

const S: Record<string, React.CSSProperties> = {
  shell: { minHeight: '100vh', background: '#f8f9fb', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 16px 80px' },
  card: { width: '100%', maxWidth: 520, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 20, padding: '40px 32px', textAlign: 'center' },
  iconWrap: { marginBottom: 20 },
  title: { fontFamily: "'Fraunces',serif", fontSize: '1.8rem', fontWeight: 500, color: '#1a1a1a', marginBottom: 16 },
  body: { fontSize: '0.95rem', color: '#6b6b6b', marginBottom: 12, lineHeight: 1.6 },
  refId: { fontSize: '0.75rem', color: '#9e9e9e', fontFamily: 'monospace', marginTop: 8, marginBottom: 28 },
  steps: { textAlign: 'left', borderTop: '1px solid #e6e8ec', paddingTop: 24, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 },
  step: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  stepN: { width: 28, height: 28, minWidth: 28, borderRadius: '50%', background: '#11EBF2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#1a1a1a', marginTop: 1 },
  stepTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 },
  stepDesc: { fontSize: '0.82rem', color: '#6b6b6b' },
}
