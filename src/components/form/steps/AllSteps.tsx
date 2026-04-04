'use client'

import { useState } from 'react'
import { useStepSubmit } from '@/hooks/useStepSubmit'

// ── Shared primitives ─────────────────────────────────────────────────────────

const BRAND = '#11EBF2'
const BRAND_DARK = '#04dee5'

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1.5 text-sm text-red-500">{msg}</p>
}

function NextBtn({ loading, disabled, label = 'Continue' }: { loading: boolean; disabled?: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      style={{ background: loading || disabled ? '#a0f0f3' : BRAND }}
      className="w-full h-12 flex items-center justify-center mt-6 rounded-full text-gray-900 font-bold text-sm uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Saving…
        </span>
      ) : label}
    </button>
  )
}

function Choice({ label, selected, onClick, multi = false }: { label: string; selected: boolean; onClick: () => void; multi?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={selected ? { background: BRAND, borderColor: BRAND } : {}}
      className={`w-full flex items-center gap-3 px-5 py-4 bg-white border rounded-xl cursor-pointer transition-all text-left text-base font-medium ${
        selected ? 'border-[#11EBF2] text-gray-900 font-semibold' : 'border-gray-200 text-gray-700 hover:border-[#11EBF2] hover:shadow-sm'
      }`}
    >
      <span className={`flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-colors ${
        multi ? 'rounded' : 'rounded-full'
      } ${selected ? 'border-gray-800 bg-gray-800' : 'border-gray-300 bg-white'}`}>
        {selected && <span className={`bg-white ${multi ? 'w-2.5 h-2.5 rounded-sm' : 'w-2 h-2 rounded-full'}`} />}
      </span>
      {label}
    </button>
  )
}

function Input({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <input
        {...props}
        className={`w-full h-14 px-4 bg-white border rounded-lg text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#11EBF2] focus:border-[#11EBF2]'
        }`}
      />
      <FieldErr msg={error} />
    </div>
  )
}

function Select({ label, error, children, ...props }: { label: string; error?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <select
        {...props}
        className={`w-full h-14 px-4 bg-white border rounded-lg text-gray-800 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-colors ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#11EBF2] focus:border-[#11EBF2]'
        }`}
      >
        {children}
      </select>
      <svg className="pointer-events-none absolute right-3 top-11 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
      </svg>
      <FieldErr msg={error} />
    </div>
  )
}

// ── STEP 1: Pain areas ────────────────────────────────────────────────────────
const PAIN_AREAS = ['Knees','Back','Neck','Hips','Shoulders','Feet','Hands','Wrist','Elbows'] as const
type PainArea = typeof PAIN_AREAS[number]

export function Step1() {
  const [selected, setSelected] = useState<PainArea[]>([])
  const { submit, isSubmitting, error } = useStepSubmit(1)
  const toggle = (a: PainArea) => setSelected(p => p.includes(a) ? p.filter(x=>x!==a) : [...p,a])
  return (
    <div className="space-y-3">
      {PAIN_AREAS.map(a => <Choice key={a} label={a} selected={selected.includes(a)} onClick={()=>toggle(a)} multi/>)}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="button"
        disabled={selected.length === 0 || isSubmitting}
        onClick={() => submit({ painAreas: selected } as any)}
        style={{ background: selected.length===0||isSubmitting ? '#a0f0f3' : BRAND }}
        className="w-full h-12 flex items-center justify-center mt-6 rounded-full text-gray-900 font-bold text-sm uppercase tracking-wider disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

// ── STEP 2: Duration ──────────────────────────────────────────────────────────
export function Step2() {
  const [selected, setSelected] = useState('')
  const { submit, isSubmitting, error } = useStepSubmit(2)
  const opts = ['Less than 5 years.','5-10 Years.','10+ Years.']
  return (
    <div className="space-y-3">
      {opts.map(o => <Choice key={o} label={o} selected={selected===o} onClick={()=>{ setSelected(o); setTimeout(()=>submit({painDuration:o} as any),120) }}/>)}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isSubmitting && <p className="text-sm text-gray-400 text-center">Saving…</p>}
    </div>
  )
}

// ── STEP 3: Gender ────────────────────────────────────────────────────────────
export function Step3() {
  const [selected, setSelected] = useState<'male'|'female'|''>('')
  const { submit, isSubmitting, error } = useStepSubmit(3)
  const pick = (g: 'male'|'female') => { setSelected(g); setTimeout(()=>submit({gender:g} as any),120) }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        {(['female','male'] as const).map(g => (
          <button key={g} type="button" onClick={()=>pick(g)}
            style={selected===g ? {background:BRAND,borderColor:BRAND} : {}}
            className={`flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 font-semibold text-lg transition-all ${
              selected===g ? 'text-gray-900' : 'bg-white border-gray-200 text-gray-700 hover:border-[#11EBF2]'
            }`}>
            <span className="text-5xl">{g==='female'?'♀':'♂'}</span>
            <span className="capitalize">{g}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isSubmitting && <p className="text-sm text-gray-400 text-center">Saving…</p>}
    </div>
  )
}

// ── STEP 4: Current RX ────────────────────────────────────────────────────────
export function Step4() {
  const [selected, setSelected] = useState('')
  const { submit, isSubmitting, error } = useStepSubmit(4)
  return (
    <div className="space-y-3">
      {(['Yes','No'] as const).map(v => <Choice key={v} label={v} selected={selected===v} onClick={()=>{ setSelected(v); setTimeout(()=>submit({currentRxMedication:v} as any),120) }}/>)}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isSubmitting && <p className="text-sm text-gray-400 text-center">Saving…</p>}
    </div>
  )
}

// ── STEP 5: Injury ────────────────────────────────────────────────────────────
export function Step5() {
  const [selected, setSelected] = useState('')
  const { submit, isSubmitting, error } = useStepSubmit(5)
  return (
    <div className="space-y-3">
      {(['Yes','No'] as const).map(v => <Choice key={v} label={v} selected={selected===v} onClick={()=>{ setSelected(v); setTimeout(()=>submit({hadInjuryOrAccident:v} as any),120) }}/>)}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isSubmitting && <p className="text-sm text-gray-400 text-center">Saving…</p>}
    </div>
  )
}

// ── STEP 6: Date of birth ─────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = Array.from({length:31},(_,i)=>String(i+1))
const YEARS  = Array.from({length:new Date().getFullYear()-1924},(_,i)=>String(new Date().getFullYear()-i))

export function Step6() {
  const [month, setMonth] = useState('')
  const [day,   setDay]   = useState('')
  const [year,  setYear]  = useState('')
  const [fieldErr, setFieldErr] = useState('')
  const { submit, isSubmitting, error } = useStepSubmit(6)

  const handleSubmit = () => {
    if (!month||!day||!year) { setFieldErr('Please complete your date of birth'); return }
    const mi = String(MONTHS.indexOf(month)+1).padStart(2,'0')
    submit({ dobMonth: mi, dobDay: day, dobYear: year } as any)
  }

  return (
    <div className="space-y-4">
      <Select label="Month" value={month} onChange={e=>setMonth(e.target.value)} error={!month&&fieldErr?'Required':''}>
        <option value="">Select month</option>
        {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Day" value={day} onChange={e=>setDay(e.target.value)} error={!day&&fieldErr?'Required':''}>
          <option value="">Day</option>
          {DAYS.map(d=><option key={d} value={d}>{d}</option>)}
        </Select>
        <Select label="Year" value={year} onChange={e=>setYear(e.target.value)} error={!year&&fieldErr?'Required':''}>
          <option value="">Year</option>
          {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
        </Select>
      </div>
      {(fieldErr||error) && <p className="text-sm text-red-500">{fieldErr||error}</p>}
      <button type="button" onClick={handleSubmit} disabled={isSubmitting}
        style={{ background: isSubmitting ? '#a0f0f3' : BRAND }}
        className="w-full h-12 flex items-center justify-center mt-2 rounded-full text-gray-900 font-bold text-sm uppercase tracking-wider disabled:cursor-not-allowed">
        {isSubmitting ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

// ── STEP 7: State ─────────────────────────────────────────────────────────────
const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

export function Step7() {
  const [state, setState] = useState('')
  const { submit, isSubmitting, error } = useStepSubmit(7)
  return (
    <div className="space-y-4">
      <Select label="State" value={state} onChange={e=>setState(e.target.value)}>
        <option value="">Select your state</option>
        {US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="button" onClick={()=>state&&submit({state} as any)} disabled={!state||isSubmitting}
        style={{ background: !state||isSubmitting ? '#a0f0f3' : BRAND }}
        className="w-full h-12 flex items-center justify-center rounded-full text-gray-900 font-bold text-sm uppercase tracking-wider disabled:cursor-not-allowed">
        {isSubmitting ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

// ── STEP 8: Pain goals ────────────────────────────────────────────────────────
const PAIN_GOALS = ['Better Mobility','Better Sleep','Mental Focus','More Confidence','More Productivity'] as const
type PainGoal = typeof PAIN_GOALS[number]

export function Step8() {
  const [selected, setSelected] = useState<PainGoal[]>([])
  const { submit, isSubmitting, error } = useStepSubmit(8)
  const toggle = (g: PainGoal) => setSelected(p=>p.includes(g)?p.filter(x=>x!==g):[...p,g])
  return (
    <div className="space-y-3">
      {PAIN_GOALS.map(g=><Choice key={g} label={g} selected={selected.includes(g)} onClick={()=>toggle(g)} multi/>)}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="button" onClick={()=>selected.length&&submit({painGoals:selected} as any)} disabled={!selected.length||isSubmitting}
        style={{ background: !selected.length||isSubmitting ? '#a0f0f3' : BRAND }}
        className="w-full h-12 flex items-center justify-center mt-2 rounded-full text-gray-900 font-bold text-sm uppercase tracking-wider disabled:cursor-not-allowed">
        {isSubmitting ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

// ── STEP 9: Name + email ──────────────────────────────────────────────────────
export function Step9() {
  const [first, setFirst]   = useState('')
  const [last,  setLast]    = useState('')
  const [email, setEmail]   = useState('')
  const [errs,  setErrs]    = useState<Record<string,string>>({})
  const { submit, isSubmitting, error } = useStepSubmit(9)

  const handleSubmit = () => {
    const e: Record<string,string> = {}
    if (!first.trim()) e.first = 'Required'
    if (!last.trim())  e.last  = 'Required'
    if (!email.includes('@')) e.email = 'Enter a valid email'
    setErrs(e)
    if (Object.keys(e).length) return
    submit({ firstName: first.trim(), lastName: last.trim(), email: email.trim() } as any)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First name" value={first} onChange={e=>setFirst(e.target.value)} placeholder="First name" error={errs.first}/>
        <Input label="Last name"  value={last}  onChange={e=>setLast(e.target.value)}  placeholder="Last name"  error={errs.last}/>
      </div>
      <Input label="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" error={errs.email}/>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="button" onClick={handleSubmit} disabled={isSubmitting}
        style={{ background: isSubmitting ? '#a0f0f3' : BRAND }}
        className="w-full h-12 flex items-center justify-center rounded-full text-gray-900 font-bold text-sm uppercase tracking-wider disabled:cursor-not-allowed">
        {isSubmitting ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

// ── STEP 10: Pain level ───────────────────────────────────────────────────────
const PAIN_LEVELS = ['10 (worst possible pain)','9','8','7','6','5 (moderate pain)','4','3','2','1 (no pain)'] as const
type PainLevel = typeof PAIN_LEVELS[number]

export function Step10() {
  const [selected, setSelected] = useState<PainLevel|''>('')
  const { submit, isSubmitting, error } = useStepSubmit(10)
  return (
    <div className="space-y-2">
      {PAIN_LEVELS.map(l=><Choice key={l} label={l} selected={selected===l} onClick={()=>{ setSelected(l); setTimeout(()=>submit({painLevel:l} as any),120) }}/>)}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isSubmitting && <p className="text-sm text-gray-400 text-center">Saving…</p>}
    </div>
  )
}

// ── STEP 11: Pregnancy (female only) ─────────────────────────────────────────
export function Step11() {
  const [selected, setSelected] = useState('')
  const { submit, isSubmitting, error } = useStepSubmit(11)
  return (
    <div className="space-y-3">
      {(['Yes','No'] as const).map(v=><Choice key={v} label={v} selected={selected===v} onClick={()=>{ setSelected(v); setTimeout(()=>submit({pregnantOrBreastfeeding:v} as any),120) }}/>)}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isSubmitting && <p className="text-sm text-gray-400 text-center">Saving…</p>}
    </div>
  )
}

// ── STEP 12: Comorbidities ────────────────────────────────────────────────────
const COMORBIDITIES = ['Heart disease','High blood pressure','Diabetes','Liver disease','Kidney disease','Cancer','Autoimmune disorder','Hormonal disorders','Neurological conditions','Gastrointestinal disease','None of the above'] as const
type Comorbidity = typeof COMORBIDITIES[number]

export function Step12() {
  const [selected, setSelected] = useState<Comorbidity[]>([])
  const [fieldErr, setFieldErr] = useState('')
  const { submit, isSubmitting, error } = useStepSubmit(12)

  const toggle = (c: Comorbidity) => {
    setFieldErr('')
    setSelected(prev => {
      if (c === 'None of the above') return prev.includes(c) ? [] : ['None of the above']
      const without = prev.filter(x=>x!=='None of the above')
      return without.includes(c) ? without.filter(x=>x!==c) : [...without, c]
    })
  }

  const handleSubmit = () => {
    if (!selected.length) { setFieldErr('Please make a selection'); return }
    submit({ comorbidities: selected } as any)
  }

  return (
    <div className="space-y-2">
      {COMORBIDITIES.map(c=><Choice key={c} label={c} selected={selected.includes(c)} onClick={()=>toggle(c)} multi/>)}
      {(fieldErr||error) && <p className="text-sm text-red-500 mt-1">{fieldErr||error}</p>}
      <button type="button" onClick={handleSubmit} disabled={isSubmitting}
        style={{ background: isSubmitting ? '#a0f0f3' : BRAND }}
        className="w-full h-12 flex items-center justify-center mt-4 rounded-full text-gray-900 font-bold text-sm uppercase tracking-wider disabled:cursor-not-allowed">
        {isSubmitting ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

// ── STEP 13: Phone + consent (final submit) ────────────────────────────────────
export function Step13() {
  const [phone,   setPhone]   = useState('')
  const [consent, setConsent] = useState(false)
  const [errs,    setErrs]    = useState<Record<string,string>>({})
  const { submit, isSubmitting, error } = useStepSubmit(13)

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g,'').slice(0,10)
    if (d.length >= 7) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
    if (d.length >= 4) return `(${d.slice(0,3)}) ${d.slice(3)}`
    if (d.length >= 1) return `(${d}`
    return d
  }

  const handleSubmit = () => {
    const e: Record<string,string> = {}
    const digits = phone.replace(/\D/g,'')
    if (digits.length !== 10) e.phone = 'Enter a valid 10-digit US phone number'
    if (!consent)             e.consent = 'You must agree to continue'
    setErrs(e)
    if (Object.keys(e).length) return
    submit({ phoneNumber: phone, smsConsent: consent } as any)
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Phone number</label>
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={e => setPhone(formatPhone(e.target.value))}
          placeholder="(000) 000-0000"
          className={`w-full h-14 px-4 bg-white border rounded-lg text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
            errs.phone ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#11EBF2] focus:border-[#11EBF2]'
          }`}
        />
        {errs.phone && <p className="mt-1.5 text-sm text-red-500">{errs.phone}</p>}
      </div>

      <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={e => { setConsent(e.target.checked); setErrs(p=>({...p,consent:''})) }}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0"
          style={{ accentColor: BRAND }}
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          By providing my information, I consent to receive phone calls and/or SMS text messages. I understand these may be sent using automated technology. Message and data rates may apply. Consent is not required to purchase any goods or services.
        </span>
      </label>
      {errs.consent && <p className="text-sm text-red-500">{errs.consent}</p>}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{ background: isSubmitting ? '#a0f0f3' : BRAND }}
        className="w-full h-12 flex items-center justify-center rounded-full text-gray-900 font-bold text-sm uppercase tracking-wider disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Submitting…</span>
          : 'Get My Results →'
        }
      </button>
    </div>
  )
}
