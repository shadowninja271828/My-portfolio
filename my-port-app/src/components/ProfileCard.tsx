import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useState } from 'react'
import { content } from '../data/content'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Socials } from './Socials'
import { T } from './Todo'

export function ProfileCard() {
  const reduced = useReducedMotion()
  const [imgOk, setImgOk] = useState(true)
  return (
    <aside aria-label="Profile" className="rounded-[24px] bg-white p-5 text-black lg:p-6">
      <div className="flex gap-4 lg:block">
        <div className="relative w-32 shrink-0 lg:w-full">
          <svg className="absolute -inset-3 size-[calc(100%+24px)]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M5 90 C 0 30, 40 -5, 95 15"
              fill="none" stroke="var(--orange)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke"
              initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }}
            />
          </svg>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-orange">
            {imgOk ? (
              <img src={content.photo} alt={`Portrait of ${content.name}`} width={600} height={800}
                   onError={() => setImgOk(false)} className="size-full object-cover" />
            ) : (
              <div className="pixel grid size-full place-items-center text-center text-xs text-black/70">PHOTO<br />PLACEHOLDER</div>
            )}
          </div>
          <motion.span
            className="absolute -right-2 -top-2 grid size-9 place-items-center rounded-full bg-orange text-white shadow"
            animate={reduced ? undefined : { scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 2.4 }}
          >
            <Flame className="size-4" aria-hidden="true" />
          </motion.span>
        </div>
        <div className="min-w-0 self-center lg:mt-6 lg:self-auto">
          <h2 className="text-2xl font-bold text-black">{content.name}</h2>
          <p className="mt-1 text-sm text-neutral-600"><T>{content.shortBio}</T></p>
          <div className="mt-4"><Socials variant="orange" max={4} /></div>
        </div>
      </div>
    </aside>
  )
}
