import { Reveal } from './Reveal'
import { T } from './Todo'

export interface TimelineItem { title: string; org: string; start: string; end: string; bullets?: string[] }

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-2 border-l border-white/15">
      {items.map((j, i) => (
        <li key={`${j.title}-${i}`} className="relative pb-10 pl-8 last:pb-0">
          <span className="absolute -left-[7px] top-1.5 size-3.5 bg-lime" aria-hidden="true" />
          <Reveal delay={i * 0.06}>
            <p className="mono text-xs uppercase text-muted">{j.start} — {j.end}</p>
            <h3 className="mt-1 text-xl font-bold"><T>{j.title}</T></h3>
            <p className="text-orange">{j.org}</p>
            {j.bullets && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted marker:text-lime">
                {j.bullets.map((b) => <li key={b}><T>{b}</T></li>)}
              </ul>
            )}
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
