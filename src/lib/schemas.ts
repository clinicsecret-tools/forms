import { z } from 'zod'

const PAIN_AREAS = ['Knees','Back','Neck','Hips','Shoulders','Feet','Hands','Wrist','Elbows'] as const
const PAIN_GOALS = ['Better Mobility','Better Sleep','Mental Focus','More Confidence','More Productivity'] as const
const COMORBIDITIES = ['Heart disease','High blood pressure','Diabetes','Liver disease','Kidney disease','Cancer','Autoimmune disorder','Hormonal disorders','Neurological conditions','Gastrointestinal disease','None of the above'] as const

export const step1Schema  = z.object({ painAreas: z.array(z.enum(PAIN_AREAS)).min(1,'Select at least one area') })
export const step2Schema  = z.object({ painDuration: z.enum(['Less than 5 years.','5-10 Years.','10+ Years.']) })
export const step3Schema  = z.object({ gender: z.enum(['male','female']) })
export const step4Schema  = z.object({ currentRxMedication: z.enum(['Yes','No']) })
export const step5Schema  = z.object({ hadInjuryOrAccident: z.enum(['Yes','No']) })
export const step6Schema  = z.object({
  dobMonth: z.string().min(1,'Required'),
  dobDay:   z.string().min(1,'Required'),
  dobYear:  z.string().min(4,'Required'),
}).superRefine(({dobMonth,dobDay,dobYear},ctx) => {
  const dob = new Date(+dobYear, +dobMonth-1, +dobDay)
  const age = Math.floor((Date.now()-dob.getTime())/31557600000)
  if (age < 18) ctx.addIssue({code:'custom',message:'You must be at least 18 years old',path:['dobYear']})
  if (age > 80) ctx.addIssue({code:'custom',message:'Please contact us directly for assistance',path:['dobYear']})
})
export const step7Schema  = z.object({ state: z.string().min(1,'Please select a state') })
export const step8Schema  = z.object({ painGoals: z.array(z.enum(PAIN_GOALS)).min(1,'Select at least one') })
export const step9Schema  = z.object({
  firstName: z.string().min(1,'First name required'),
  lastName:  z.string().min(1,'Last name required'),
  email:     z.string().email('Enter a valid email address'),
})
export const step10Schema = z.object({ painLevel: z.enum(['10 (worst possible pain)','9','8','7','6','5 (moderate pain)','4','3','2','1 (no pain)']) })
export const step11Schema = z.object({ pregnantOrBreastfeeding: z.enum(['Yes','No']) })
export const step12Schema = z.object({ comorbidities: z.array(z.enum(COMORBIDITIES)).min(1,'Please make a selection') })
  .superRefine(({comorbidities},ctx) => {
    if (comorbidities.includes('None of the above') && comorbidities.length > 1)
      ctx.addIssue({code:'custom',message:'"None of the above" cannot be combined with other selections',path:['comorbidities']})
  })
export const step13Schema = z.object({
  phoneNumber: z.string().transform(v=>v.replace(/\D/g,'')).refine(v=>v.length===10,'Enter a valid 10-digit US phone number'),
  smsConsent:  z.boolean().refine(v=>v===true,'You must agree to continue'),
})

export const STEP_SCHEMAS = {
  1:step1Schema, 2:step2Schema, 3:step3Schema, 4:step4Schema,
  5:step5Schema, 6:step6Schema, 7:step7Schema, 8:step8Schema,
  9:step9Schema, 10:step10Schema, 11:step11Schema, 12:step12Schema,
  13:step13Schema,
} as const
export type StepNumber = keyof typeof STEP_SCHEMAS
