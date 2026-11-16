import { content } from '../data/content'
import { Reveal } from './Reveal'
import { T } from './Todo'

export function SkillChips() {
  return (
    <div className="grid gap-3 md:gap-6 md:grid-cols-3">
      {content.skills.map((g, gi) => (
        <Reveal key={g.title} delay={gi * 0.08}>
          <div className="h-full rounded-[20px] md:rounded-[24px] border border-white/10 bg-surface p-4 md:p-6">
            <h3 className="pixel mb-3 md:mb-4 text-xs text-orange">{g.title.toUpperCase()}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li key={s} className="mono rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-white"><T>{s}</T></li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
