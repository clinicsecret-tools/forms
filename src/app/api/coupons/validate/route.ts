import { NextRequest, NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/coupons'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    const result = await validateCoupon(code)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[coupons/validate] error', err)
    return NextResponse.json(
      {
        valid: false,
        code: '',
        amountOff: 0,
        message: 'Unable to validate coupon right now.',
      },
      { status: 500 }
    )
  }
}
