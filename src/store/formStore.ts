import { create } from 'zustand'
import type { Gender } from '@/types'

interface FormStore {
  submissionId: string | null
  gender: Gender | null
  skippedSteps: number[]
  setSubmissionId: (id: string) => void
  setGender: (g: Gender) => void
  skipStep: (n: number) => void
  isSkipped: (n: number) => boolean
  reset: () => void
}

export const useFormStore = create<FormStore>((set, get) => ({
  submissionId: null,
  gender: null,
  skippedSteps: [],
  setSubmissionId: id => set({ submissionId: id }),
  setGender: g => set({ gender: g }),
  skipStep: n => set(s => ({ skippedSteps: [...new Set([...s.skippedSteps, n])] })),
  isSkipped: n => get().skippedSteps.includes(n),
  reset: () => set({ submissionId: null, gender: null, skippedSteps: [] }),
}))

export const TOTAL_STEPS = 13
