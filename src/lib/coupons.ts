import { prisma } from '@/lib/db'

export interface CouponResult {
  valid: boolean
  code: string
  amountOff: number
  message?: string
}

const DEFAULT_COUPON_CODE = (process.env.DEFAULT_COUPON_CODE ?? 'PENTA100').toUpperCase()
const DEFAULT_COUPON_AMOUNT = Number(process.env.DEFAULT_COUPON_AMOUNT_CENTS ?? 10000)

export async function validateCoupon(rawCode?: string | null): Promise<CouponResult> {
  const normalized = (rawCode ?? '').trim().toUpperCase()

  if (!normalized) {
    return {
      valid: false,
      code: '',
      amountOff: 0,
      message: 'No coupon code provided.',
    }
  }

  const dbCoupon = await prisma.coupon.findUnique({ where: { code: normalized } })

  if (dbCoupon) {
    const exhausted = dbCoupon.maxRedemptions !== null && dbCoupon.redeemedCount >= dbCoupon.maxRedemptions
    const expired = dbCoupon.expiresAt !== null && dbCoupon.expiresAt.getTime() < Date.now()

    if (!dbCoupon.isActive || exhausted || expired) {
      return {
        valid: false,
        code: normalized,
        amountOff: 0,
        message: 'Coupon is invalid or expired.',
      }
    }

    return {
      valid: true,
      code: normalized,
      amountOff: dbCoupon.amountOff,
      message: `Coupon applied: -$${(dbCoupon.amountOff / 100).toFixed(2)}`,
    }
  }

  // Backward-compatible fallback so coupon works even before DB seed.
  if (normalized === DEFAULT_COUPON_CODE) {
    return {
      valid: true,
      code: normalized,
      amountOff: DEFAULT_COUPON_AMOUNT,
      message: `Coupon applied: -$${(DEFAULT_COUPON_AMOUNT / 100).toFixed(2)}`,
    }
  }

  return {
    valid: false,
    code: normalized,
    amountOff: 0,
    message: 'Invalid coupon code.',
  }
}
