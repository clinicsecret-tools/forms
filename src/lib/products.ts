import type { Product } from '@/types'

// ─── Replace these with your actual Stripe Price IDs and product details ──────
// You can also load these from env vars or a database

export const PRODUCTS: Product[] = [
  {
    id: 'pain-relief-1mo',
    name: '1-Month Supply',
    description: 'Prescription pain relief — 30-day supply',
    stripePriceId: process.env.STRIPE_PRICE_1MO ?? 'price_REPLACE_ME',
    stripeRecurringPriceId: process.env.STRIPE_PRICE_1MO_SUB,
    amount: 9900,        // $99.00 in cents
    currency: 'usd',
    badge: undefined,
  },
  {
    id: 'pain-relief-3mo',
    name: '3-Month Supply',
    description: 'Prescription pain relief — 90-day supply, best value',
    stripePriceId: process.env.STRIPE_PRICE_3MO ?? 'price_REPLACE_ME',
    stripeRecurringPriceId: process.env.STRIPE_PRICE_3MO_SUB,
    amount: 24900,       // $249.00 in cents
    currency: 'usd',
    popular: true,
    badge: 'Most Popular',
  },
  {
    id: 'pain-relief-6mo',
    name: '6-Month Supply',
    description: 'Prescription pain relief — 180-day supply, maximum savings',
    stripePriceId: process.env.STRIPE_PRICE_6MO ?? 'price_REPLACE_ME',
    stripeRecurringPriceId: process.env.STRIPE_PRICE_6MO_SUB,
    amount: 44900,       // $449.00 in cents
    currency: 'usd',
    badge: 'Best Value',
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function formatAmount(amount: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}
