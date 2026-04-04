import { notFound } from 'next/navigation'
import {
  Step1,Step2,Step3,Step4,Step5,Step6,Step7,
  Step8,Step9,Step10,Step11,Step12,Step13,
} from '@/components/form/steps/AllSteps'
import { ProgressBar } from '@/components/layout/ProgressBar'

const STEPS: Record<number, { component: React.ComponentType; title: string; subtitle?: string }> = {
  1:  { component: Step1,  title: 'Where do you feel pain?',                              subtitle: 'Select all that apply' },
  2:  { component: Step2,  title: 'How long have you had pain?' },
  3:  { component: Step3,  title: "What's your gender?" },
  4:  { component: Step4,  title: 'Are you currently taking prescription medication for pain?' },
  5:  { component: Step5,  title: 'Did you have an injury or accident that started the pain?', subtitle: 'e.g. fall, car accident, or work-related injury' },
  6:  { component: Step6,  title: 'What is your date of birth?' },
  7:  { component: Step7,  title: 'For state medication rules',                            subtitle: 'What state are you in?' },
  8:  { component: Step8,  title: 'How would pain relief help you most?',                 subtitle: 'Select all that apply' },
  9:  { component: Step9,  title: 'For prescription approval, please tell us the following.' },
  10: { component: Step10, title: 'What is your pain level?',                             subtitle: '1 = no pain · 10 = worst possible pain' },
  11: { component: Step11, title: 'Are you currently pregnant, breastfeeding, or planning to become pregnant?' },
  12: { component: Step12, title: 'Do any of the following apply to you?' },
  13: { component: Step13, title: "Almost done! Ready for your results?",                 subtitle: 'Our doctor may call you — enter your best phone number.' },
}

export default function StepPage({ params }: { params: { step: string } }) {
  const n = parseInt(params.step)
  if (isNaN(n) || n < 1 || n > 13) notFound()
  const cfg = STEPS[n]
  if (!cfg) notFound()
  const { component: StepComponent, title, subtitle } = cfg

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProgressBar currentStep={n} totalSteps={13} />
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-7">
            <h1 className="text-[21px] font-semibold text-gray-800 leading-snug">{title}</h1>
            {subtitle && <p className="mt-2 text-[15px] text-gray-500">{subtitle}</p>}
          </div>
          <StepComponent />
        </div>
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return Array.from({ length: 13 }, (_, i) => ({ step: String(i + 1) }))
}
