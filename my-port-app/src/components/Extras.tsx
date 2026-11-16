import { ChevronDown, Star } from 'lucide-react'
import { useId, useState } from 'react'
import { content } from '../data/content'
import { Reveal } from './Reveal'

export function Testimonials() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {content.testimonials.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.08}>
          <figure className="h-full rounded-[24px] border border-white/10 bg-surface p-6">
            <div className="mb-3 flex gap-1" role="img" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, n) => <Star key={n} className={`size-4 ${n < t.rating ? 'fill-lime text-lime' : 'text-white/20'}`} aria-hidden="true" />)}
            </div>
            <blockquote className="text-sm text-white/90">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm"><strong>{t.name}</strong> <span className="text-muted">· {t.role}</span></figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  )
}

export function Faq() {
  const uid = useId()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-white/10 rounded-[24px] border border-white/10 bg-surface">
      {content.faq.map((f, i) => (
        <div key={f.q}>
          <h3>
            <button aria-expanded={open === i} aria-controls={`${uid}-${i}`} onClick={() => setOpen(open === i ? null : i)}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-6 text-left font-semibold">
              {f.q}<ChevronDown className={`size-4 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
          </h3>
          <div id={`${uid}-${i}`} role="region" hidden={open !== i} className="px-6 pb-5 text-sm text-muted">{f.a}</div>
        </div>
      ))}
    </div>
  )
}
