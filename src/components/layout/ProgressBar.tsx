'use client'

export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const pct = Math.round((currentStep / totalSteps) * 100)
  return (
    <div className="w-full bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-xs font-semibold text-gray-600">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: '#11EBF2' }}
          />
        </div>
      </div>
    </div>
  )
}
