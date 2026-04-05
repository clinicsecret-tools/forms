import type { Product } from '@/types'

export const PRODUCTS: Product[] = [
  {
    id: 'pentadeca-arginate-1mo',
    name: 'PentaDeca Arginate — 1 Month',
    description: '$297/month recurring subscription',
    stripePriceId: process.env.STRIPE_PRICE_PENTA_1MO ?? 'price_REPLACE_ME',
    stripeRecurringPriceId: process.env.STRIPE_PRICE_PENTA_1MO_SUB,
    amount: 29700,
    currency: 'usd',
    interval: 'month',
    popular: true,
    badge: 'Most Popular',
  },
  {
    id: 'pentadeca-arginate-3mo',
    name: 'PentaDeca Arginate — 3 Months',
    description: '$697 every 3 months',
    stripePriceId: process.env.STRIPE_PRICE_PENTA_3MO ?? 'price_REPLACE_ME',
    stripeRecurringPriceId: process.env.STRIPE_PRICE_PENTA_3MO_SUB,
    amount: 69700,
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
