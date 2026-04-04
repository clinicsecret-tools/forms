'use client'

import { clsx } from 'clsx'

// ── Error message ─────────────────────────────────────────────────────────────

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
      <span>⚠</span> {message}
    </p>
  )
}

// ── Submit / Next button ──────────────────────────────────────────────────────

interface SubmitButtonProps {
  isSubmitting: boolean
  label?: string
  disabled?: boolean
}

export function SubmitButton({
  isSubmitting,
  label = 'Next',
  disabled,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting || disabled}
      className="btn-primary mt-6"
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <Spinner /> Please wait...
        </span>
      ) : (
        label
      )}
    </button>
  )
}

// ── Choice card (radio / checkbox) ────────────────────────────────────────────

interface ChoiceCardProps {
  label: string
  selected: boolean
  onClick: () => void
  type?: 'radio' | 'checkbox'
}

export function ChoiceCard({
  label,
  selected,
  onClick,
  type = 'radio',
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx('choice-card', selected && 'selected')}
    >
      {/* Indicator */}
      <span
        className={clsx(
          'flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-colors',
          type === 'radio' ? 'rounded-full' : 'rounded',
          selected
            ? 'border-gray-800 bg-gray-800'
            : 'border-gray-300 bg-white'
        )}
      >
        {selected && (
          <span
            className={clsx(
              'bg-white',
              type === 'radio' ? 'w-2 h-2 rounded-full' : 'w-2.5 h-2.5 rounded-sm'
            )}
          />
        )}
      </span>
      <span>{label}</span>
    </button>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────

export function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ── Select wrapper with chevron ───────────────────────────────────────────────

interface SelectWrapperProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export function SelectWrapper({ error, className, ...props }: SelectWrapperProps) {
  return (
    <div className="relative">
      <select
        className={clsx(
          'form-select pr-10',
          error && 'border-red-400 focus:ring-red-300',
          className
        )}
        {...props}
      />
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
