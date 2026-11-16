import { Check, ChevronDown, MessageCircle } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { content } from '../data/content'
import { addMessage } from '../data/messages'
import { Reveal } from './Reveal'

type Status = 'idle' | 'submitting' | 'success' | 'error'
interface Errors { name?: string; email?: string; message?: string }

/** Backend adapter: Formspree if VITE_FORMSPREE_ID is set, else EmailJS if its keys are set, else a mock. */
async function send(data: Record<string, string>): Promise<void> {
  const env = import.meta.env
  if (env.VITE_FORMSPREE_ID) {
    const r = await fetch(`https://formspree.io/f/${env.VITE_FORMSPREE_ID}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data),
    })
    if (!r.ok) throw new Error('formspree')
    return
  }
  if (env.VITE_EMAILJS_SERVICE && env.VITE_EMAILJS_TEMPLATE && env.VITE_EMAILJS_KEY) {
    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: env.VITE_EMAILJS_SERVICE, template_id: env.VITE_EMAILJS_TEMPLATE, user_id: env.VITE_EMAILJS_KEY, template_params: data }),
    })
    if (!r.ok) throw new Error('emailjs')
    return
  }
  console.info('[ContactForm] No backend configured; mock send:', data)
  await new Promise((res) => setTimeout(res, 800))
}

function Select({ id, label, options, value, onChange }: { id: string; label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHi((h) => Math.min(options.length - 1, h + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (open) { onChange(options[hi]); setOpen(false) } else setOpen(true) }
    else if (e.key === 'Escape') setOpen(false)
  }
  return (
    <div ref={box} className="relative">
      <label id={`${id}-l`} className="mb-2 block text-sm font-medium">{label}</label>
      <button type="button" id={id} role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-labelledby={`${id}-l ${id}`}
        onClick={() => setOpen((o) => !o)} onKeyDown={key}
        className="flex min-h-12 w-full items-center justify-between rounded-xl bg-surface-2 px-4 text-left text-sm">
        <span className={value ? '' : 'text-muted'}>{value || 'Select a budget'}</span>
        <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-l`} className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-surface shadow-xl">
          {options.map((o, i) => (
            <li key={o} role="option" aria-selected={o === value} onMouseEnter={() => setHi(i)} onClick={() => { onChange(o); setOpen(false) }}
              className={`flex min-h-11 cursor-pointer items-center justify-between px-4 text-sm ${i === hi ? 'bg-surface-2 text-lime' : ''}`}>
              {o}{o === value && <Check className="size-4" aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const input = 'min-h-12 w-full rounded-xl bg-surface-2 px-4 text-sm text-white placeholder:text-muted'

export function ContactForm() {
  const uid = useId()
  const [v, setV] = useState({ name: '', email: '', phone: '', whatsapp: '', budget: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const validate = (): Errors => {
    const e: Errors = {}
    if (!v.name.trim()) e.name = 'Please enter your name.'
    if (!v.email.trim()) e.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Please enter a valid email address.'
    if (!v.message.trim()) e.message = 'Please write a message.'
    return e
  }

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setStatus('submitting')
    try { await addMessage(v); await send(v); setStatus('success'); setV({ name: '', email: '', phone: '', whatsapp: '', budget: '', message: '' }) }
    catch { setStatus('error') }
  }

  const err = (id: string, m?: string) => m && <p id={`${id}-e`} role="alert" className="mt-1 text-xs text-orange">{m}</p>

  const waDigits = content.whatsappBusiness.replace(/\D/g, '')

  return (
    <section id="contact" aria-labelledby="contact-h" className="mt-28">
      <Reveal>
        <h2 id="contact-h" className="display text-[clamp(2.5rem,6vw,5.5rem)]">
          <span className="block text-white">{content.contactHeadline[0]}</span>
          <span className="block text-[#4a4947]">{content.contactHeadline[1]}</span>
        </h2>
        {waDigits && (
          <a
            href={`https://wa.me/${waDigits}`}
            target="_blank"
            rel="noreferrer noopener"
            className="pixel-btn mt-6 inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-lime px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp Business ({content.whatsappBusiness})
          </a>
        )}
      </Reveal>
      <Reveal delay={0.1}>
        <form onSubmit={submit} noValidate className="mt-10 grid gap-5 md:grid-cols-2" aria-busy={status === 'submitting'}>
          <div>
            <label htmlFor={`${uid}n`} className="mb-2 block text-sm font-medium">Name</label>
            <input id={`${uid}n`} className={input} placeholder="Your name" autoComplete="name" value={v.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}n-e` : undefined}
              onChange={(e) => setV({ ...v, name: e.target.value })} disabled={status === 'submitting'} />
            {err(`${uid}n`, errors.name)}
          </div>
          <div>
            <label htmlFor={`${uid}e`} className="mb-2 block text-sm font-medium">Email</label>
            <input id={`${uid}e`} type="email" className={input} placeholder="you@example.com" autoComplete="email" value={v.email} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}e-e` : undefined}
              onChange={(e) => setV({ ...v, email: e.target.value })} disabled={status === 'submitting'} />
            {err(`${uid}e`, errors.email)}
          </div>
          <div>
            <label htmlFor={`${uid}p`} className="mb-2 block text-sm font-medium">Contact number <span className="text-muted">(optional)</span></label>
            <input id={`${uid}p`} type="tel" className={input} placeholder="+1 555 123 4567" autoComplete="tel" value={v.phone}
              onChange={(e) => setV({ ...v, phone: e.target.value })} disabled={status === 'submitting'} />
          </div>
          <div>
            <label htmlFor={`${uid}w`} className="mb-2 block text-sm font-medium">WhatsApp number <span className="text-muted">(optional)</span></label>
            <input id={`${uid}w`} type="tel" className={input} placeholder="+1 555 123 4567" autoComplete="tel" value={v.whatsapp}
              onChange={(e) => setV({ ...v, whatsapp: e.target.value })} disabled={status === 'submitting'} />
          </div>
          <div className="md:col-span-2">
            <Select id={`${uid}b`} label="Budget" options={content.budgetOptions} value={v.budget} onChange={(b) => setV({ ...v, budget: b })} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${uid}m`} className="mb-2 block text-sm font-medium">Message</label>
            <textarea id={`${uid}m`} rows={6} className={`${input} py-3`} placeholder="Tell me about your project" value={v.message} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${uid}m-e` : undefined}
              onChange={(e) => setV({ ...v, message: e.target.value })} disabled={status === 'submitting'} />
            {err(`${uid}m`, errors.message)}
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={status === 'submitting'}
              className="min-h-12 w-full rounded-xl bg-orange px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60">
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </button>
            <div aria-live="polite" className="mt-3 min-h-6 text-sm">
              {status === 'success' && <p className="text-lime">Thanks! Your message was sent.</p>}
              {status === 'error' && <p className="text-orange">Something went wrong. Please try again.</p>}
            </div>
          </div>
        </form>
      </Reveal>
    </section>
  )
}
