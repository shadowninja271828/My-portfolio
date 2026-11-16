import { motion } from 'framer-motion'
import { content } from '../data/content'
import { ICON_MAP } from './StatCounter'
import { Reveal } from './Reveal'
import { T } from './Todo'

const Topo = () => (
  <svg className="pointer-events-none absolute inset-0 size-full opacity-15" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="#000" strokeWidth="1">
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M-10 ${100 - i * 14} C 40 ${60 - i * 10}, 90 ${130 - i * 16}, 210 ${50 - i * 8}`} />)}
  </svg>
)
const Peaks = () => (
  <svg className="pointer-events-none absolute inset-0 size-full opacity-15" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="#000" strokeWidth="1">
    {[0, 1, 2, 3].map((i) => <polyline key={i} points={`0,${110 - i * 12} 40,${60 - i * 8} 70,${90 - i * 10} 110,${30 - i * 5} 150,${80 - i * 8} 200,${40 - i * 4}`} />)}
  </svg>
)

export function BentoGrid() {
  return (
    <section id="services" aria-labelledby="services-h" className="mt-24">
      <h2 id="services-h" className="pixel mb-6 text-sm text-lime">01 WHAT I BUILD</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {content.services.map((s, i) => {
          const Icon = ICON_MAP[s.icon]
          const orange = i % 2 === 0
          return (
            <Reveal key={s.title} delay={i * 0.08}>
              <motion.article
                whileHover="hover"
                className={`relative h-full min-h-56 overflow-hidden rounded-[24px] p-7 text-black ${orange ? 'bg-orange' : 'bg-lime'}`}
              >
                {orange ? <Topo /> : <Peaks />}
                <motion.div variants={{ hover: { rotate: -8 } }} className="relative mb-12 inline-grid size-12 place-items-center rounded-xl border-2 border-black">
                  <Icon className="size-6" aria-hidden="true" />
                </motion.div>
                <h3 className="relative text-2xl font-extrabold uppercase tracking-tight">{s.title}</h3>
                <p className="relative mt-2 max-w-sm text-sm font-medium"><T>{s.text}</T></p>
              </motion.article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
