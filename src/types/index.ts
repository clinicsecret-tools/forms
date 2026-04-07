// ─── Affiliate / Tracking ────────────────────────────────────────────────────

export type AffiliateSource =
  | 'everflow'
  | 'katalys'
  | 'google'
  | 'facebook'
  | 'taboola'
  | 'samcart'
  | 'cx_referral'
  | 'organic'

export interface AffiliateParams {
  // UTM standard
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  utm_adgroup?: string

  // Everflow
  oid?: string
  affid?: string
  new_id?: string
  transaction_id?: string
  ef_transaction_id?: string
  creative_id?: string
  source_id?: string

  // Katalys
  offer_id?: string
  publisher_id?: string
  placement_id?: string

  // Sub-IDs (shared across networks)
  sub1?: string
  sub2?: string
  sub3?: string
  sub4?: string
  sub5?: string

  // Click IDs
  gclid?: string
  fbclid?: string
  tbclid?: string
  ttclid?: string
  msclkid?: string
  click_id?: string

  // SamCart / custom
  sc_ref?: string
  sc_vis?: string
  aff_id?: string
  cs_campaign?: string
  cs_page?: string

  // Business context
  coupon?: string
  promo?: string
  intake_class?: string
  domain?: string
  caller_page?: string
  order_id?: string
  csioid?: string

  // Resolved
  resolvedSource?: AffiliateSource
  tracking_unid?: string
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface SessionData {
  affiliateParams: AffiliateParams
  submissionId?: string      // UUID created at step 1
  lastStepReached?: number
  patientEmail?: string
  patientName?: string
  selectedProductId?: string
  stripeCustomerId?: string
  createdAt?: string
}

// ─── Form Steps ──────────────────────────────────────────────────────────────

export type PainArea =
  | 'Knees' | 'Back' | 'Neck' | 'Hips' | 'Shoulders'
  | 'Feet' | 'Hands' | 'Wrist' | 'Elbows'

export type PainDuration =
  | 'Less than 5 years.'
  | '5-10 Years.'
  | '10+ Years.'

export type Gender = 'male' | 'female'

export type PainGoal =
  | 'Better Mobility'
  | 'Better Sleep'
  | 'Mental Focus'
  | 'More Confidence'
  | 'More Productivity'

export type Comorbidity =
  | 'Heart disease'
  | 'High blood pressure'
  | 'Diabetes'
  | 'Liver disease'
  | 'Kidney disease'
  | 'Cancer'
  | 'Autoimmune disorder'
  | 'Hormonal disorders'
  | 'Neurological conditions'
  | 'Gastrointestinal disease'
  | 'None of the above'

export interface Step1Data {
  painAreas: PainArea[]
}

export interface Step2Data {
  painDuration: PainDuration
}

export interface Step3Data {
  gender: Gender
}

export interface Step4Data {
  currentRxMedication: 'Yes' | 'No'
}

export interface Step5Data {
  hadInjuryOrAccident: 'Yes' | 'No'
}

export interface Step6Data {
  dobMonth: string   // '01'–'12'
  dobDay: string     // '1'–'31'
  dobYear: string    // '1925'–'2025'
}

export interface Step7Data {
  state: string
}

export interface Step8Data {
  painGoals: PainGoal[]
}

export interface Step9Data {
  firstName: string
  lastName: string
  email: string
}

export interface Step10Data {
  painLevel: string  // '1 (no pain)' to '10 (worst possible pain)'
}

export interface Step11Data {
  pregnantOrBreastfeeding: 'Yes' | 'No'
}

export interface Step12Data {
  comorbidities: Comorbidity[]
  phoneNumber: string
  smsConsent: boolean
}

export type StepData =
  | Step1Data | Step2Data | Step3Data | Step4Data
  | Step5Data | Step6Data | Step7Data | Step8Data
  | Step9Data | Step10Data | Step11Data | Step12Data

export interface StepSubmitRequest {
  step: number
  data: StepData
  submissionId?: string
}

export interface StepSubmitResponse {
  ok: boolean
  submissionId: string
  nextStep?: number
  skipToStep?: number   // e.g. skip step 11 for male
  redirectTo?: string   // set on step 12 → '/products?...'
  error?: string
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  description: string
  stripePriceId: string           // one-time
  stripeRecurringPriceId?: string // subscription
  amount: number                  // cents
  currency: string
  interval?: 'month' | 'year'
  popular?: boolean
  badge?: string
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface CreatePaymentIntentRequest {
  productId: string
  paymentType: 'one_time' | 'subscription'
  coupon?: string
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  amount: number
  originalAmount: number
  currency: string
  paymentIntentId: string
  couponCode?: string
  couponAmountOff?: number
}

// ─── CRM ─────────────────────────────────────────────────────────────────────

export interface CRMPayload {
  submissionId: string
  step: number
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  affiliateParams: AffiliateParams
  stepData: Record<string, unknown>
  timestamp: string
}

export interface Step13Data {
  phoneNumber: string
  smsConsent:  boolean
}
