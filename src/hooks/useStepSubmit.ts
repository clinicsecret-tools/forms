'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import type { StepData, Step3Data } from '@/types'

export function useStepSubmit(step: number) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { submissionId, setSubmissionId, setGender, skipStep, isSkipped } = useFormStore()

  const submit = async (data: StepData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/form/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, data, submissionId }),
      })
      const result = await res.json()

      if (!result.ok) {
        setError(result.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (result.submissionId) setSubmissionId(result.submissionId)

      // Gender skip logic
      if (step === 3) {
        const d = data as Step3Data
        setGender(d.gender)
        if (d.gender === 'male') skipStep(11)
      }

      if (result.redirectTo) {
        router.push(result.redirectTo)
        return
      }

      if (result.nextStep) {
        let next: number = result.nextStep
        while (isSkipped(next) && next <= 13) next++
        router.push(`/form/${next}`)
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, error }
}
