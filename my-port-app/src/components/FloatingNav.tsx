import { motion } from 'framer-motion'
import { Briefcase, Folder, Home, PenSquare, Wrench } from 'lucide-react'
import { useState } from 'react'
import { content } from '../data/content'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { PixelCrown } from './PixelCrown'

const ICONS: Record<string, typeof Home> = {
  home: Home, projects: Folder, experience: Briefcase, skills: Wrench, contact: PenSquare,
}

export function FloatingNav({ ids }: { ids: string[] }) {
  const active = useScrollSpy(ids)
  const [hover, setHover] = useState<string | null>(null)
  const items = content.nav.filter((n) => ids.includes(n.id))
  return (
    <nav aria-label="Primary" className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <ul className="flex items-center gap-1 rounded-[20px] border border-white/10 bg-surface/90 p-1.5 shadow-xl backdrop-blur">
        <li className="px-2" aria-hidden="true"><PixelCrown size={22} /></li>
        {items.map((n) => {
          const Icon = ICONS[n.id] ?? Home
          const on = active === n.id
          return (
            <li key={n.id} className="relative">
              <a
                href={`#${n.id}`}
                aria-label={n.label}
                aria-current={on ? 'true' : undefined}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover(null)}
                className="relative grid size-11 place-items-center rounded-2xl transition-transform hover:scale-110"
              >
                {on && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-lime"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className={`relative size-5 ${on ? 'text-black' : 'text-white'}`} aria-hidden="true" />
              </a>
              {hover === n.id && (
                <span role="tooltip" className="pixel pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] uppercase text-lime">
                  {n.label}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
